import React, { useState, useEffect } from "react";
import { TextField, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "../styles/header.css";

const Header = () => {
  const navigate = useNavigate();

  const [numCows, setNumCows] = useState(0);
  const [milkMatrix, setMilkMatrix] = useState([]);
  const [milkErrors, setMilkErrors] = useState([]);
  const [calculatedData, setCalculatedData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [numCowsError, setNumCowsError] = useState("");

  const handleMilkChange = (value, dayIndex, cowIndex) => {
    let numericValue = parseFloat(value);
    let newMatrix = [...milkMatrix];
    let newErrors = [...milkErrors];

    if (!newErrors[dayIndex]) newErrors[dayIndex] = [];

    if (isNaN(numericValue) || numericValue < 0) numericValue = "";
    if (numericValue > 11.9) {
      newErrors[dayIndex][cowIndex] = "Máximo 11.9 litros";
    } else {
      newErrors[dayIndex][cowIndex] = "";
    }

    newMatrix[dayIndex][cowIndex] = numericValue;
    setMilkMatrix([...newMatrix]);
    setMilkErrors([...newErrors]);
    setErrorMessage("");
  };

  const handleGenerateMatrix = (values) => {
    const numCowsInt = parseInt(values.numCows, 10);

    if (numCowsInt < 3) {
      setNumCowsError("⚠️ Debe haber al menos 3 vacas.");
      return;
    }
    if (numCowsInt > 50) {
      setNumCowsError("⚠️ No puede haber más de 50 vacas.");
      return;
    }

    setNumCowsError("");
    setNumCows(numCowsInt);
    setMilkMatrix(Array.from({ length: 7 }, () => Array(numCowsInt).fill("")));
    setMilkErrors(Array.from({ length: 7 }, () => Array(numCowsInt).fill("")));
  };

  const isMatrixComplete = () => {
    return milkMatrix.every((row) => row.every((cell) => cell !== ""));
  };

  const handleCalculateData = () => {
    if (!isMatrixComplete()) {
      setErrorMessage("⚠️ Debes llenar todos los campos antes de calcular.");
      return;
    }

    const formattedData = milkMatrix.flatMap((row, dayIndex) =>
      row.map((value, cowIndex) => ({
        dia: `Día ${dayIndex + 1}`,
        vaca: `Vaca ${cowIndex + 1}`,
        litros: value || 0,
      }))
    );

    setCalculatedData(formattedData);
  };

  useEffect(() => {
    if (calculatedData.length > 0) {
      console.log("Datos calculados:", calculatedData);
      navigate(`/totals`, { state: { milkData: calculatedData } });
    }
  }, [calculatedData, navigate]);

  return (
    <Box className="container">
      <Typography className="title" variant="h4" gutterBottom>
        Hacienda 7 Vacas Flacas
      </Typography>

      <Formik
        initialValues={{ numCows: "" }}
        validationSchema={Yup.object({
          numCows: Yup.number()
            .required("Este campo es obligatorio")
            .integer("Debe ser un número entero")
            .positive("Debe ser un número positivo"),
        })}
        onSubmit={handleGenerateMatrix}
      >
        {({ handleChange, handleBlur }) => (
          <Form>
            <Box className="form-container">
              <Field
                name="numCows"
                as={TextField}
                label="Número de vacas"
                type="number"
                onChange={(e) => {
                  handleChange(e);
                  setNumCowsError("");
                }}
                onBlur={(e) => {
                  handleBlur(e);
                  const value = parseInt(e.target.value, 10);
                  if (value < 3) {
                    setNumCowsError("⚠️ Debe haber al menos 3 vacas.");
                  } else if (value > 50) {
                    setNumCowsError("⚠️ No puede haber más de 50 vacas.");
                  } else {
                    setNumCowsError("");
                  }
                }}
                variant="outlined"
                fullWidth
                error={Boolean(numCowsError)}
                helperText={numCowsError}
                className="textfield"
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={Boolean(numCowsError)}
              >
                Generar Matriz
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      {milkMatrix.length > 0 && (
        <>
          <Box className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Día</th>
                  {Array.from({ length: milkMatrix[0].length }, (_, index) => (
                    <th key={index}>Vaca {index + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {milkMatrix.map((row, dayIndex) => (
                  <tr key={dayIndex}>
                    <td>Día {dayIndex + 1}</td>
                    {row.map((value, cowIndex) => (
                      <td key={cowIndex}>
                        <TextField
                          type="number"
                          value={value}
                          onChange={(e) =>
                            handleMilkChange(e.target.value, dayIndex, cowIndex)
                          }
                          error={Boolean(
                            milkErrors[dayIndex] &&
                              milkErrors[dayIndex][cowIndex]
                          )}
                          helperText={
                            milkErrors[dayIndex] &&
                            milkErrors[dayIndex][cowIndex]
                              ? milkErrors[dayIndex][cowIndex]
                              : ""
                          }
                          inputMode="decimal"
                          pattern="[0-9]+(\.[0-9]+)?"
                          size="small"
                          variant="outlined"
                          fullWidth
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          {errorMessage && (
            <Typography className="error-message" variant="body1" color="error">
              {errorMessage}
            </Typography>
          )}

          <Box className="button-container">
            <Button
              variant="contained"
              onClick={handleCalculateData}
              disabled={!isMatrixComplete()}
            >
              Calcular Datos
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Header;
