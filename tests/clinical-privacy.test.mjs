import assert from "node:assert/strict";
import test from "node:test";
import { containsDirectPatientIdentifiers } from "../clinical-privacy.ts";

test("rejects synthetic direct identifiers", () => {
  const unsafe = [
    "Escribe a ejemplo@dominio.test",
    "DNI: 12345678Z",
    "NIE X1234567L",
    "Teléfono: 612 345 678",
    "+34 612 345 678",
    "IBAN: ES12 1234 1234 1234 1234 1234",
    "Nombre completo: Persona Ficticia",
    "Fecha de nacimiento: 02/01/1990",
    "calle Inventada 12"
  ];
  for (const candidate of unsafe) assert.equal(
    containsDirectPatientIdentifiers(candidate), true, candidate
  );
});

test("accepts ordinary anonymised clinical notes", () => {
  const safe = [
    "Persona adulta con preocupación persistente; se plantea trabajar defusión cognitiva.",
    "Dificultades de memoria, atención y funcionamiento cotidiano sin diagnóstico confirmado.",
    "Paciente refiere ansiedad en el trabajo y preocupación por el futuro."
  ];
  for (const candidate of safe) assert.equal(
    containsDirectPatientIdentifiers(candidate), false, candidate
  );
});
