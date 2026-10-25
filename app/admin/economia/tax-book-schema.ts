// Column order and two heading rows transcribed from AEAT plantilla 09-09-2026.
// https://sede.agenciatributaria.gob.es/static_files/Sede/Tema/IVA/Fact_registro/Libros/PLANTILLA_LIBROS_UNIFICADOS.xlsx
export type BookKind = "income" | "expense" | "investment";
export type BookColumn = {key:string;label:string;format:string;kind:string};
export type BookSchema = {sheet:string;headers:string[][];columns:BookColumn[]};
export const schema:Record<BookKind,BookSchema> = {
  "income": {
    "sheet": "EXPEDIDAS_INGRESOS",
    "headers": [
      [
        "Autoliquidación",
        "",
        "Actividad",
        "",
        "",
        "Tipo de Factura",
        "Concepto de Ingreso",
        "Ingreso Computable",
        "Fecha Expedición",
        "Fecha Operación",
        "Identificación de la Factura",
        "",
        "",
        "NIF Destinatario",
        "",
        "",
        "Nombre Destinatario",
        "Clave de Operación",
        "Calificación de la Operación",
        "Operación Exenta",
        "Total Factura",
        "Base Imponible",
        "Tipo de IVA",
        "Cuota IVA Repercutida",
        "Tipo de Recargo Eq.",
        "Cuota Recargo Eq.",
        "Cobro (Operación Criterio de Caja de IVA y/o artículo 7.2.1º de Reglamento del IRPF)",
        "",
        "",
        "",
        "Tipo Retención del IRPF",
        "Importe Retenido del IRPF",
        "Registro Acuerdo Facturación",
        "Inmueble",
        "",
        "Refrencia Externa"
      ],
      [
        "Ejercicio",
        "Periodo",
        "Código",
        "Tipo",
        "Grupo o Epígrafe del IAE",
        "",
        "",
        "",
        "",
        "",
        "Serie",
        "Número",
        "Número-Final",
        "Tipo",
        "Código País",
        "Identificación",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Fecha",
        "Importe",
        "Medio Utilizado",
        "Identificación Medio Utilizado",
        "",
        "",
        "",
        "Situación",
        "Referencia Catastral",
        ""
      ]
    ],
    "columns": [
      {
        "key": "c01",
        "label": "Autoliquidación · Ejercicio",
        "format": "Decimal (4,0)",
        "kind": "number"
      },
      {
        "key": "c02",
        "label": "Autoliquidación · Periodo",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c03",
        "label": "Actividad · Código",
        "format": "Alfanumérico (1)",
        "kind": "text"
      },
      {
        "key": "c04",
        "label": "Actividad · Tipo",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c05",
        "label": "Actividad · Grupo o Epígrafe del IAE",
        "format": "Alfanumérico (4)",
        "kind": "text"
      },
      {
        "key": "c06",
        "label": "Tipo de Factura",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c07",
        "label": "Concepto de Ingreso",
        "format": "Alfanumérico (3)",
        "kind": "text"
      },
      {
        "key": "c08",
        "label": "Ingreso Computable",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c09",
        "label": "Fecha Expedición",
        "format": "Fecha(dd/mm/yyyy)",
        "kind": "date"
      },
      {
        "key": "c10",
        "label": "Fecha Operación",
        "format": "Fecha(dd/mm/yyyy)",
        "kind": "date"
      },
      {
        "key": "c11",
        "label": "Identificación de la Factura · Serie",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c12",
        "label": "Identificación de la Factura · Número",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c13",
        "label": "Identificación de la Factura · Número-Final",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c14",
        "label": "NIF Destinatario · Tipo",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c15",
        "label": "NIF Destinatario · Código País",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c16",
        "label": "NIF Destinatario · Identificación",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c17",
        "label": "Nombre Destinatario",
        "format": "Alfanumérico (40)",
        "kind": "text"
      },
      {
        "key": "c18",
        "label": "Clave de Operación",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c19",
        "label": "Calificación de la Operación",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c20",
        "label": "Operación Exenta",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c21",
        "label": "Total Factura",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c22",
        "label": "Base Imponible",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c23",
        "label": "Tipo de IVA",
        "format": "Decimal(4,2)",
        "kind": "number"
      },
      {
        "key": "c24",
        "label": "Cuota IVA Repercutida",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c25",
        "label": "Tipo de Recargo Eq.",
        "format": "Decimal(4,2)",
        "kind": "number"
      },
      {
        "key": "c26",
        "label": "Cuota Recargo Eq.",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c27",
        "label": "Cobro (Operación Criterio de Caja de IVA y/o artículo 7.2.1º de Reglamento del IRPF) · Fecha",
        "format": "Fecha(dd/mm/yyyy)",
        "kind": "date"
      },
      {
        "key": "c28",
        "label": "Cobro (Operación Criterio de Caja de IVA y/o artículo 7.2.1º de Reglamento del IRPF) · Importe",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c29",
        "label": "Cobro (Operación Criterio de Caja de IVA y/o artículo 7.2.1º de Reglamento del IRPF) · Medio Utilizado",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c30",
        "label": "Cobro (Operación Criterio de Caja de IVA y/o artículo 7.2.1º de Reglamento del IRPF) · Identificación Medio Utilizado",
        "format": "Alfanumérico (34)",
        "kind": "text"
      },
      {
        "key": "c31",
        "label": "Tipo Retención del IRPF",
        "format": "Decimal(4,2)",
        "kind": "number"
      },
      {
        "key": "c32",
        "label": "Importe Retenido del IRPF",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c33",
        "label": "Registro Acuerdo Facturación",
        "format": "Alfanumérico (15)",
        "kind": "text"
      },
      {
        "key": "c34",
        "label": "Inmueble · Situación",
        "format": "Alfanumérico (1)",
        "kind": "text"
      },
      {
        "key": "c35",
        "label": "Inmueble · Referencia Catastral",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c36",
        "label": "Referencia Externa",
        "format": "Alfanumérico (40)",
        "kind": "text"
      }
    ]
  },
  "expense": {
    "sheet": "RECIBIDAS_GASTOS",
    "headers": [
      [
        "Autoliquidación",
        "",
        "Actividad",
        "",
        "",
        "Tipo de Factura",
        "Concepto de Gasto",
        "Gasto Deducible",
        "Fecha Expedición",
        "Fecha Operación",
        "Identificación Factura del Expedidor",
        "",
        "Fecha Recepción",
        "Número Recepción",
        "Número Recepción Final",
        "NIF Expedidor",
        "",
        "",
        "Nombre Expedidor",
        "Clave de Operación",
        "Bien de Inversión",
        "Inversión del Sujeto Pasivo",
        "Deducible en Periodo Posterior",
        "Periodo Deducción",
        "",
        "Total Factura",
        "Base Imponible",
        "Tipo de IVA",
        "Cuota IVA Soportado",
        "Cuota Deducible",
        "Tipo de Recargo Eq.",
        "Cuota Recargo Eq.",
        "Pago (Operación Criterio de Caja de IVA y/o artículo 7.2.1º de Reglamento del IRPF)",
        "",
        "",
        "",
        "Tipo Retención del IRPF",
        "Importe Retenido del IRPF",
        "Registro Acuerdo Facturación",
        "Inmueble",
        "",
        "RefErencia Externa"
      ],
      [
        "Ejercicio",
        "Periodo",
        "Código",
        "Tipo",
        "Grupo o Epígrafe del IAE",
        "",
        "",
        "",
        "",
        "",
        "(Serie-Número)",
        "Número-Final",
        "",
        "",
        "",
        "Tipo",
        "Código País",
        "Identificación",
        "",
        "",
        "",
        "",
        "",
        "Ejercicio",
        "Periodo",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Fecha",
        "Importe",
        "Medio Utilizado",
        "Identificación Medio Utilizado",
        "",
        "",
        "",
        "Situación",
        "Referencia Catastral",
        ""
      ]
    ],
    "columns": [
      {
        "key": "c01",
        "label": "Autoliquidación · Ejercicio",
        "format": "Decimal (4,0)",
        "kind": "number"
      },
      {
        "key": "c02",
        "label": "Autoliquidación · Periodo",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c03",
        "label": "Actividad · Código",
        "format": "Alfanumérico (1)",
        "kind": "text"
      },
      {
        "key": "c04",
        "label": "Actividad · Tipo",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c05",
        "label": "Actividad · Grupo o Epígrafe del IAE",
        "format": "Alfanumérico (4)",
        "kind": "text"
      },
      {
        "key": "c06",
        "label": "Tipo de Factura",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c07",
        "label": "Concepto de Gasto",
        "format": "Alfanumérico (3)",
        "kind": "text"
      },
      {
        "key": "c08",
        "label": "Gasto Deducible",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c09",
        "label": "Fecha Expedición",
        "format": "Fecha(dd/mm/yyyy)",
        "kind": "date"
      },
      {
        "key": "c10",
        "label": "Fecha Operación",
        "format": "Fecha(dd/mm/yyyy)",
        "kind": "date"
      },
      {
        "key": "c11",
        "label": "Identificación Factura del Expedidor · (Serie-Número)",
        "format": "Alfanumérico (40)",
        "kind": "text"
      },
      {
        "key": "c12",
        "label": "Identificación Factura del Expedidor · Número-Final",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c13",
        "label": "Fecha Recepción",
        "format": "Fecha(dd/mm/yyyy)",
        "kind": "date"
      },
      {
        "key": "c14",
        "label": "Número Recepción",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c15",
        "label": "Número Recepción Final",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c16",
        "label": "NIF Expedidor · Tipo",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c17",
        "label": "NIF Expedidor · Código País",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c18",
        "label": "NIF Expedidor · Identificación",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c19",
        "label": "Nombre Expedidor",
        "format": "Alfanumérico (40)",
        "kind": "text"
      },
      {
        "key": "c20",
        "label": "Clave de Operación",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c21",
        "label": "Bien de Inversión",
        "format": "Alfanumérico (1)",
        "kind": "text"
      },
      {
        "key": "c22",
        "label": "Inversión del Sujeto Pasivo",
        "format": "Alfanumérico (1)",
        "kind": "text"
      },
      {
        "key": "c23",
        "label": "Deducible en Periodo Posterior",
        "format": "Alfanumérico (1)",
        "kind": "text"
      },
      {
        "key": "c24",
        "label": "Periodo Deducción · Ejercicio",
        "format": "Decimal (4,0)",
        "kind": "number"
      },
      {
        "key": "c25",
        "label": "Periodo Deducción · Periodo",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c26",
        "label": "Total Factura",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c27",
        "label": "Base Imponible",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c28",
        "label": "Tipo de IVA",
        "format": "Decimal(4,2)",
        "kind": "number"
      },
      {
        "key": "c29",
        "label": "Cuota IVA Soportado",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c30",
        "label": "Cuota Deducible",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c31",
        "label": "Tipo de Recargo Eq.",
        "format": "Decimal(4,2)",
        "kind": "number"
      },
      {
        "key": "c32",
        "label": "Cuota Recargo Eq.",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c33",
        "label": "Pago (Operación Criterio de Caja de IVA y/o artículo 7.2.1º de Reglamento del IRPF) · Fecha",
        "format": "Fecha(dd/mm/yyyy)",
        "kind": "date"
      },
      {
        "key": "c34",
        "label": "Pago (Operación Criterio de Caja de IVA y/o artículo 7.2.1º de Reglamento del IRPF) · Importe",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c35",
        "label": "Pago (Operación Criterio de Caja de IVA y/o artículo 7.2.1º de Reglamento del IRPF) · Medio Utilizado",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c36",
        "label": "Pago (Operación Criterio de Caja de IVA y/o artículo 7.2.1º de Reglamento del IRPF) · Identificación Medio Utilizado",
        "format": "Alfanumérico (34)",
        "kind": "text"
      },
      {
        "key": "c37",
        "label": "Tipo Retención del IRPF",
        "format": "Decimal(4,2)",
        "kind": "number"
      },
      {
        "key": "c38",
        "label": "Importe Retenido del IRPF",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c39",
        "label": "Registro Acuerdo Facturación",
        "format": "Alfanumérico (15)",
        "kind": "text"
      },
      {
        "key": "c40",
        "label": "Inmueble · Situación",
        "format": "Alfanumérico (1)",
        "kind": "text"
      },
      {
        "key": "c41",
        "label": "Inmueble · Referencia Catastral",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c42",
        "label": "Referencia Externa",
        "format": "Alfanumérico (40)",
        "kind": "text"
      }
    ]
  },
  "investment": {
    "sheet": "BIENES-INVERSIÓN",
    "headers": [
      [
        "Autoliquidación",
        "",
        "Actividad",
        "",
        "",
        "Tipo de Bien",
        "Descripción del Bien",
        "",
        "Fecha Inicio Utilización",
        "Valor Adquisición",
        "Valor Amortizable",
        "Método de Amortización",
        "Porcentaje de Amortización",
        "Amortización",
        "",
        "",
        "",
        "Fecha Expedición",
        "Identificación Factura del Expedidor",
        "",
        "Número Recepción",
        "Número Recepción Final",
        "NIF Expedidor",
        "",
        "",
        "Nombre Expedidor",
        "Año de Inicio Utilización",
        "",
        "",
        "",
        "Regularización Anual",
        "",
        "",
        "Baja del Bien",
        "",
        "Identificación de la Factura de Transmisión del Bien",
        "",
        "",
        "Registro Acuerdo Facturación",
        "Inmueble",
        "",
        "Refrencia Externa"
      ],
      [
        "Ejercicio",
        "Periodo",
        "Código",
        "Tipo",
        "Grupo o Epígrafe del IAE",
        "",
        "Identificador",
        "Literal",
        "",
        "",
        "",
        "",
        "",
        "Acumulada al Inicio",
        "Cuota Resultante",
        "Acumulada al final",
        "Pendiente",
        "",
        "(Serie-Número)",
        "Número-Final",
        "",
        "",
        "Tipo",
        "Código País",
        "Identificación",
        "",
        "Base Imponible",
        "Tipo de IVA",
        "Prorrata Definitiva",
        "Cuota Deducible",
        "Prorrata Definitiva",
        "Cuota Deducible",
        "Cuota a Regularizar",
        "Fecha",
        "Causa",
        "Serie",
        "Número",
        "Número-Final",
        "",
        "Situación",
        "Referencia Catastral",
        ""
      ]
    ],
    "columns": [
      {
        "key": "c01",
        "label": "Autoliquidación · Ejercicio",
        "format": "Decimal (4,0)",
        "kind": "number"
      },
      {
        "key": "c02",
        "label": "Autoliquidación · Periodo",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c03",
        "label": "Actividad · Código",
        "format": "Alfanumérico (1)",
        "kind": "text"
      },
      {
        "key": "c04",
        "label": "Actividad · Tipo",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c05",
        "label": "Actividad · Grupo o Epígrafe del IAE",
        "format": "Alfanumérico (4)",
        "kind": "text"
      },
      {
        "key": "c06",
        "label": "Tipo de Bien",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c07",
        "label": "Descripción del Bien · Identificador",
        "format": "Alfanumérico (40)",
        "kind": "text"
      },
      {
        "key": "c08",
        "label": "Descripción del Bien · Literal",
        "format": "Alfanumérico (160)",
        "kind": "text"
      },
      {
        "key": "c09",
        "label": "Fecha Inicio Utilización",
        "format": "Fecha(dd/mm/yyyy)",
        "kind": "date"
      },
      {
        "key": "c10",
        "label": "Valor Adquisición",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c11",
        "label": "Valor Amortizable",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c12",
        "label": "Método de Amortización",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c13",
        "label": "Porcentaje de Amortización",
        "format": "Decimal (4,2)",
        "kind": "number"
      },
      {
        "key": "c14",
        "label": "Amortización · Acumulada al Inicio",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c15",
        "label": "Amortización · Cuota Resultante",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c16",
        "label": "Amortización · Acumulada al final",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c17",
        "label": "Amortización · Pendiente",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c18",
        "label": "Fecha Expedición",
        "format": "Fecha(dd/mm/yyyy)",
        "kind": "date"
      },
      {
        "key": "c19",
        "label": "Identificación Factura del Expedidor · (Serie-Número)",
        "format": "Alfanumérico (40)",
        "kind": "text"
      },
      {
        "key": "c20",
        "label": "Identificación Factura del Expedidor · Número-Final",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c21",
        "label": "Número Recepción",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c22",
        "label": "Número Recepción Final",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c23",
        "label": "NIF Expedidor · Tipo",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c24",
        "label": "NIF Expedidor · Código País",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c25",
        "label": "NIF Expedidor · Identificación",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c26",
        "label": "Nombre Expedidor",
        "format": "Alfanumérico (40)",
        "kind": "text"
      },
      {
        "key": "c27",
        "label": "Año de Inicio Utilización · Base Imponible",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c28",
        "label": "Año de Inicio Utilización · Tipo de IVA",
        "format": "Decimal(4,2)",
        "kind": "number"
      },
      {
        "key": "c29",
        "label": "Año de Inicio Utilización · Prorrata Definitiva",
        "format": "Decimal(5,2)",
        "kind": "number"
      },
      {
        "key": "c30",
        "label": "Año de Inicio Utilización · Cuota Deducible",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c31",
        "label": "Regularización Anual · Prorrata Definitiva",
        "format": "Decimal(5,2)",
        "kind": "number"
      },
      {
        "key": "c32",
        "label": "Regularización Anual · Cuota Deducible",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c33",
        "label": "Regularización Anual · Cuota a Regularizar",
        "format": "Decimal(12,2)",
        "kind": "number"
      },
      {
        "key": "c34",
        "label": "Baja del Bien · Fecha",
        "format": "Fecha(dd/mm/yyyy)",
        "kind": "date"
      },
      {
        "key": "c35",
        "label": "Baja del Bien · Causa",
        "format": "Alfanumérico (2)",
        "kind": "text"
      },
      {
        "key": "c36",
        "label": "Identificación de la Factura de Transmisión del Bien · Serie",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c37",
        "label": "Identificación de la Factura de Transmisión del Bien · Número",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c38",
        "label": "Identificación de la Factura de Transmisión del Bien · Número-Final",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c39",
        "label": "Registro Acuerdo Facturación",
        "format": "Alfanumérico (15)",
        "kind": "text"
      },
      {
        "key": "c40",
        "label": "Inmueble · Situación",
        "format": "Alfanumérico (1)",
        "kind": "text"
      },
      {
        "key": "c41",
        "label": "Inmueble · Referencia Catastral",
        "format": "Alfanumérico (20)",
        "kind": "text"
      },
      {
        "key": "c42",
        "label": "Referencia Externa",
        "format": "Alfanumérico (40)",
        "kind": "text"
      }
    ]
  }
};

export const choices:Record<BookKind,Record<string,{value:string;label:string}[]>> = {
  "income": {
    "c03": [
      {
        "value": "A",
        "label": "A-Actividades incluidas en el I.A.E."
      },
      {
        "value": "B",
        "label": "B-Actividades no incluidas en el I.A.E."
      },
      {
        "value": "C",
        "label": "C-Actividades no iniciadas"
      },
      {
        "value": "D",
        "label": "D-Arrendadores de inmuebles no incluidos en los códigos anteriores"
      }
    ],
    "c06": [
      {
        "value": "F1",
        "label": "F1-Factura en la que se identifica al destinatario "
      },
      {
        "value": "F2",
        "label": "F2-Factura sin identificación del destinatario "
      },
      {
        "value": "F3",
        "label": "F3-Factura sustitutiva sin una anotación negativa "
      },
      {
        "value": "F4",
        "label": "F4-Asiento resumen de facturas "
      },
      {
        "value": "R1",
        "label": "R1-Factura Rectif. (Error derecho y Art. 80 Uno Dos y Seis LIVA) "
      },
      {
        "value": "R2",
        "label": "R2-Factura Rectif. (Art. 80.tres, por concurso de acreedores) "
      },
      {
        "value": "R3",
        "label": "R3-Factura Rectif. (Art. 80.cuatro, por crédito incobrable) "
      },
      {
        "value": "R4",
        "label": "R4-Factura Rectif. (Resto) "
      },
      {
        "value": "R5",
        "label": "R5-Factura Rectif. en facturas simplificadas y facturas sin identificación del destinatario "
      },
      {
        "value": "SF",
        "label": "SF-Asiento sin obligación de emitir factura"
      },
      {
        "value": "DV",
        "label": "DV-Asiento por Devol. en Régimen de Viajeros o su modificación"
      },
      {
        "value": "AJ",
        "label": "AJ-Asiento para realizar los ajustes periódicos que reflejen el correspondiente impuesto devengado incluido en la liquidación del impuesto"
      }
    ],
    "c07": [
      {
        "value": "I01",
        "label": "I01-Ingresos de explotación"
      },
      {
        "value": "I02",
        "label": "I02-Ingresos financieros derivados del aplazamiento o fraccionamiento de operaciones"
      },
      {
        "value": "I03",
        "label": "I03-Ingresos por subvenciones corrientes"
      },
      {
        "value": "I04",
        "label": "I04-Imputación de ingresos por subvenciones de capital"
      },
      {
        "value": "I05",
        "label": "I05-IVA devengado (recargo de equivalencia y/o recargo de agricultura, ganadería y pesca)."
      },
      {
        "value": "I06",
        "label": "I06-Variación de existencias (incremento de existencias finales)."
      },
      {
        "value": "I07",
        "label": "I07-Otros ingresos"
      },
      {
        "value": "I08",
        "label": "I08-Autoconsumo de bienes y servicios"
      },
      {
        "value": "I09",
        "label": "I09-Transmisión elementos patrimoniales libertad amortización: exceso amortización deducida respecto amortización deducible (DA trigésima Ley Impuesto)"
      }
    ],
    "c14": [
      {
        "value": "02",
        "label": "02-NIF-IVA intracomunitario"
      },
      {
        "value": "03",
        "label": "03-Pasaporte"
      },
      {
        "value": "04",
        "label": "04-Documento oficial de identificación expedido por el país o territorio de residencia."
      },
      {
        "value": "05",
        "label": "05-Certificado de Residencia."
      },
      {
        "value": "06",
        "label": "06-Otro documento probatorio."
      }
    ],
    "c18": [
      {
        "value": "01",
        "label": "01-Operación de régimen general"
      },
      {
        "value": "02",
        "label": "02-Exportación."
      },
      {
        "value": "03",
        "label": "03-Régimen especial de bienes usados, objetos de arte, antigüedades y objetos de colección."
      },
      {
        "value": "04",
        "label": "04-Régimen especial del oro de inversión."
      },
      {
        "value": "05",
        "label": "05-Régimen especial de las agencias de viajes."
      },
      {
        "value": "06",
        "label": "06-Régimen especial grupo de entidades en IVA (Nivel Avanzado)"
      },
      {
        "value": "07",
        "label": "07-Régimen especial del Criterio de Caja"
      },
      {
        "value": "08",
        "label": "08-Operaciones sujetas al IPSI / IGIC "
      },
      {
        "value": "09",
        "label": "09-Facturación de las prestaciones de servicios de agencias de viaje que actúan como mediadoras en nombre y por cuenta ajena "
      },
      {
        "value": "10",
        "label": "10-Cobros por cuenta de terceros de honorarios profesionales o de derechos derivados de la propiedad industrial, de autor u otros por cuenta de sus socios, asociados o colegiados efectuados por sociedades, asociaciones, colegios profesionales u otras entidades que realicen estas funciones de cobro."
      },
      {
        "value": "11",
        "label": "11-Operaciones de arrendamiento de local de negocio sujetas a retención."
      },
      {
        "value": "12",
        "label": "12-Operaciones de arrendamiento de local de negocio no sujetos a retención."
      },
      {
        "value": "13",
        "label": "13-Operaciones de arrendamiento de local de negocio sujetas y no sujetas a retención."
      },
      {
        "value": "14",
        "label": "14-Factura con IVA pendiente de devengo en certificaciones de obra cuyo destinatario sea una Administración Pública."
      },
      {
        "value": "15",
        "label": "15-Factura con IVA pendiente de devengo en operaciones de tracto sucesivo.  "
      },
      {
        "value": "17",
        "label": "17-Operación acogida a alguno de los regímenes previstos en el Capítulo XI del Título IX (OSS e IOSS)"
      },
      {
        "value": "18",
        "label": "18-Operaciones de actividades incluidas en el Régimen Especial de Recargo de Equivalencia (RERE)"
      },
      {
        "value": "19",
        "label": "19-Operaciones de actividades incluidas en el Régimen Especial de Agricultura, Ganadería y Pesca (REAGYP)"
      }
    ],
    "c19": [
      {
        "value": "S1",
        "label": "S1-Operación Sujeta y No exenta - Sin inversión del sujeto pasivo."
      },
      {
        "value": "S2",
        "label": "S2-Operación Sujeta y No exenta - Con Inversión del sujeto pasivo."
      },
      {
        "value": "N1",
        "label": "N1-Operación No Sujeta artículo 7, 14, otros."
      },
      {
        "value": "N2",
        "label": "N2-Operación No Sujeta por Reglas de localización."
      }
    ],
    "c20": [
      {
        "value": "E1",
        "label": "E1-exenta por el artículo 20"
      },
      {
        "value": "E2",
        "label": "E2-exenta por el artículo 21"
      },
      {
        "value": "E3",
        "label": "E3-exenta por el artículo 22"
      },
      {
        "value": "E4",
        "label": "E4-exenta por el artículo 23 y   24"
      },
      {
        "value": "E5",
        "label": "E5-exenta por el artículo 25"
      },
      {
        "value": "E6",
        "label": "E6-exenta por otros"
      }
    ]
  },
  "expense": {
    "c03": [
      {
        "value": "A",
        "label": "A-Actividades incluidas en el I.A.E."
      },
      {
        "value": "B",
        "label": "B-Actividades no incluidas en el I.A.E."
      },
      {
        "value": "C",
        "label": "C-Actividades no iniciadas"
      },
      {
        "value": "D",
        "label": "D-Arrendadores de inmuebles no incluidos en los códigos anteriores"
      }
    ],
    "c06": [
      {
        "value": "F1",
        "label": "F1-Factura en la que se identifica al destinatario"
      },
      {
        "value": "F2",
        "label": "F2-Factura sin identificación del destinatario"
      },
      {
        "value": "F3",
        "label": "F3-Factura sustitutiva sin una anotación negativa que anule las facturas simplificadas a las que sustituye. Sólo utilizarán este tipo aquellos obligados que registren facturas en sustitución de facturas simplificadas."
      },
      {
        "value": "F4",
        "label": "F4-Asiento resumen de facturas"
      },
      {
        "value": "F5",
        "label": "F5-Importaciones (DUA)"
      },
      {
        "value": "F6",
        "label": "F6-Justificantes contables"
      },
      {
        "value": "R1",
        "label": "R1-Factura Rectificativa (Error fundado en derecho y Art. 80 Uno Dos y Seis LIVA)"
      },
      {
        "value": "R2",
        "label": "R2-Factura Rectificativa (Art. 80.tres, por concurso de acreedores)"
      },
      {
        "value": "R3",
        "label": "R3-Factura Rectificativa (Art. 80.cuatro, por crédito incobrable)"
      },
      {
        "value": "R4",
        "label": "R4-Factura Rectificativa (Resto)"
      },
      {
        "value": "R5",
        "label": "R5-Factura Rectificativa en facturas simplificadas  y facturas sin identificación del destinatario  "
      },
      {
        "value": "LC",
        "label": "LC-Aduanas - Liquidación complementaria"
      },
      {
        "value": "SF",
        "label": "SF-Asiento sin obligación de emitir factura. En caso del libro del IVA, este valor sólo se podrá utilizar para el asiento por ajuste de la prorrata y sólo lleva cuota."
      }
    ],
    "c07": [
      {
        "value": "G01",
        "label": "G01-Compra de existencias"
      },
      {
        "value": "G02",
        "label": "G02-Variación de existencias (disminución de existencias finales)"
      },
      {
        "value": "G03",
        "label": "G03-Otros consumos de explotación"
      },
      {
        "value": "G04",
        "label": "G04-Sueldos y salarios"
      },
      {
        "value": "G05",
        "label": "G05-Seguridad Social a cargo de la empresa"
      },
      {
        "value": "G06",
        "label": "G06-Seguridad Social y Aportaciones a mutualidades alternativas del titular de la"
      },
      {
        "value": "G45",
        "label": "G45-Seguridad Social del titular de la actividad (se admite G06 hasta 1T 2024)"
      },
      {
        "value": "G46",
        "label": "G46-Aportaciones a mutualidades alternativas del titular de la actividad (se admite G06 hasta 1T 2024)"
      },
      {
        "value": "G07",
        "label": "G07-Indemnizaciones"
      },
      {
        "value": "G08",
        "label": "G08-Dietas y asignaciones de viajes del personal empleado"
      },
      {
        "value": "G09",
        "label": "G09-Aportaciones a sistemas de previsión social imputadas al personal empleado"
      },
      {
        "value": "G10",
        "label": "G10-Otros gastos de personal"
      },
      {
        "value": "G11",
        "label": "G11-Gastos de manutención del contribuyente (artículo 30.2.5ª.c de la Ley del Impuesto)"
      },
      {
        "value": "G12",
        "label": "G12-Arrendamientos y cánones"
      },
      {
        "value": "G13",
        "label": "G13-Reparaciones y conservación"
      },
      {
        "value": "GY4",
        "label": "GY4-Suministros (electricidad, agua, gas, telefonía e internet)"
      },
      {
        "value": "G14",
        "label": "G14-Gastos por suministro eléctrico"
      },
      {
        "value": "G15",
        "label": "G15-Gastos por suministro de agua"
      },
      {
        "value": "G16",
        "label": "G16-Gastos por suministro de gas"
      },
      {
        "value": "G17",
        "label": "G17-Gastos por suministro de telefonía e internet"
      },
      {
        "value": "G18",
        "label": "G18-Otros suministros"
      },
      {
        "value": "G19",
        "label": "G19-Servicios de profesionales independientes."
      },
      {
        "value": "G40",
        "label": "G40-Gastos de Formalización de Contratos"
      },
      {
        "value": "G41",
        "label": "G41-Gastos de Defensa Jurídica"
      },
      {
        "value": "G42",
        "label": "G42-Otras cantidades devengadas por terceros por servicios personales"
      },
      {
        "value": "G20",
        "label": "G20-Primas de seguros"
      },
      {
        "value": "G22",
        "label": "G22-Otros servicios exteriores."
      },
      {
        "value": "G44",
        "label": "G44-Gastos de Comunidad"
      },
      {
        "value": "G23",
        "label": "G23-Intereses de deudas"
      },
      {
        "value": "G24",
        "label": "G24-Otros gastos financieros"
      },
      {
        "value": "G25",
        "label": "G25-IVA soportado (recargo de equivalencia y/o recargo de agricultura, ganadería y pesca)"
      },
      {
        "value": "G26",
        "label": "G26-Otros tributos fiscalmente deducibles"
      },
      {
        "value": "GY8",
        "label": "GY8-Dotaciones del ejercicio para amortización del inmovilizado material."
      },
      {
        "value": "G27",
        "label": "G27-Dotaciones del ejercicio para amortización de edificios"
      },
      {
        "value": "G28",
        "label": "G28-Dotaciones del ejercicio para amortización de instalaciones, mobiliario, enseres y resto IM"
      },
      {
        "value": "G29",
        "label": "G29-Dotaciones del ejercicio para amortización de maquinaria"
      },
      {
        "value": "G30",
        "label": "G30-Dotaciones del ejercicio para amortización de elementos de transporte"
      },
      {
        "value": "G31",
        "label": "G31-Dotaciones del ejercicio para amortización de equipos electrónicos e informáticos"
      },
      {
        "value": "G32",
        "label": "G32-Dotaciones del ejercicio para amortización de útiles y herramientas"
      },
      {
        "value": "G33",
        "label": "G33-Dotaciones del ejercicio para amortización de ganado y cultivos agrícolas amortizables"
      },
      {
        "value": "G38",
        "label": "G38-Dotaciones del ejercicio para amortización del inmovilizado inmaterial"
      },
      {
        "value": "G34",
        "label": "G34-Pérdidas por insolvencias de deudores"
      },
      {
        "value": "G35",
        "label": "G35-Incentivos al mecenazgo. Convenios de colaboración en actividades de interés general"
      },
      {
        "value": "G36",
        "label": "G36-Incentivos al mecenazgo. Gastos en actividades de interés general"
      },
      {
        "value": "G43",
        "label": "G43-Saldos de dudoso cobro"
      },
      {
        "value": "G37",
        "label": "G37-Otros conceptos fiscalmente deducibles (excepto provisiones)"
      },
      {
        "value": "G39",
        "label": "G39-Provisiones fiscalmente deducibles"
      },
      {
        "value": "G47",
        "label": "G47-Regularización RETA (a ingresar)"
      },
      {
        "value": "G48",
        "label": "G48-Regularización RETA (devolución)"
      }
    ],
    "c16": [
      {
        "value": "02",
        "label": "02-NIF-IVA intracomunitario"
      },
      {
        "value": "03",
        "label": "03-Pasaporte"
      },
      {
        "value": "04",
        "label": "04-Documento oficial de identificación expedido por el país o territorio de residencia."
      },
      {
        "value": "05",
        "label": "05-Certificado de Residencia."
      },
      {
        "value": "06",
        "label": "06-Otro documento probatorio."
      }
    ],
    "c20": [
      {
        "value": "01",
        "label": "01-Operación de régimen general"
      },
      {
        "value": "02",
        "label": "02-Operación por la que se satisfacen compensaciones a proveedores acogidos al Régimen Especial de Agricultura Ganadería y Pesca (REAGYP) "
      },
      {
        "value": "03",
        "label": "03-Régimen especial de bienes usados, objetos de arte, antigüedades y objetos de colección."
      },
      {
        "value": "04",
        "label": "04-Régimen especial del oro de inversión."
      },
      {
        "value": "05",
        "label": "05-Régimen especial de las agencias de viajes."
      },
      {
        "value": "06",
        "label": "06-Régimen especial grupo de entidades en IVA (Nivel Avanzado)"
      },
      {
        "value": "07",
        "label": "07-Régimen especial del Criterio de Caja"
      },
      {
        "value": "08",
        "label": "08-Operaciones sujetas al IPSI / IGIC "
      },
      {
        "value": "09",
        "label": "09-Adquisiciones intracomunitarias de bienes y prestaciones de servicios."
      },
      {
        "value": "12",
        "label": "12-Operaciones de arrendamiento de local de negocio."
      },
      {
        "value": "13",
        "label": "13-Factura correspondiente a una importación (informada sin asociar a un DUA)."
      },
      {
        "value": "18",
        "label": "18-Operaciones de actividades incluidas en el Régimen Especial de Recargo de Equivalencia (RERE)"
      },
      {
        "value": "19",
        "label": "19-Operaciones de actividades incluidas en el Régimen Especial de Agricultura, Ganadería y Pesca (REAGYP)"
      }
    ]
  },
  "investment": {
    "c03": [
      {
        "value": "A",
        "label": "A-Actividades incluidas en el I.A.E."
      },
      {
        "value": "B",
        "label": "B-Actividades no incluidas en el I.A.E."
      },
      {
        "value": "C",
        "label": "C-Actividades no iniciadas"
      },
      {
        "value": "D",
        "label": "D-Arrendadores de inmuebles no incluidos en los códigos anteriores"
      }
    ],
    "c06": [
      {
        "value": "11",
        "label": "11-Terrenos dedicados exclusivamente a escombreras"
      },
      {
        "value": "12",
        "label": "12-Edificaciones y Construcciones"
      },
      {
        "value": "21",
        "label": "21-Maquinaria"
      },
      {
        "value": "22",
        "label": "22-Elementos de Transporte"
      },
      {
        "value": "23",
        "label": "23-Ordenadores y otros equipos informáticos"
      },
      {
        "value": "24",
        "label": "24-Mobiliario"
      },
      {
        "value": "25",
        "label": "25-Instalaciones"
      },
      {
        "value": "26",
        "label": "26-Barcos y Aeronaves"
      },
      {
        "value": "27",
        "label": "27-Batea"
      },
      {
        "value": "28",
        "label": "28-Útiles y Herramientas"
      },
      {
        "value": "29",
        "label": "29-Otro Inmovilizado Material"
      },
      {
        "value": "31",
        "label": "31-Patentes y Marcas"
      },
      {
        "value": "32",
        "label": "32-Derechos de Traspaso"
      },
      {
        "value": "33",
        "label": "33-Aplicaciones Informáticas"
      },
      {
        "value": "39",
        "label": "39-Otro Inmovilizado Intangible "
      },
      {
        "value": "41",
        "label": "41-Ganado vacuno, porcino, ovino y caprino"
      },
      {
        "value": "42",
        "label": "42-Ganado equino y frutales no cítricos"
      },
      {
        "value": "43",
        "label": "43-Frutales cítricos y viñedos"
      },
      {
        "value": "44",
        "label": "44-Olivar"
      },
      {
        "value": "49",
        "label": "49-Otros Bienes Semovientes y Agrícolas"
      }
    ],
    "c12": [
      {
        "value": "01",
        "label": "01-Sistema de amortización lineal según tablas."
      },
      {
        "value": "02",
        "label": "02-Sistema de amortización según porcentaje constante sobre el importe pendiente de amortización"
      },
      {
        "value": "03",
        "label": "03-Sistema de amortización según número dígitos."
      },
      {
        "value": "04",
        "label": "04-Planes de amortización"
      },
      {
        "value": "05",
        "label": "05-Depreciación efectiva probada fehacientemente"
      },
      {
        "value": "06",
        "label": "06-Libertad de Amortización"
      },
      {
        "value": "07",
        "label": "07-Amortización Acelerada"
      },
      {
        "value": "08",
        "label": "08-Amortización de Elementos Adquiridos Usados"
      },
      {
        "value": "09",
        "label": "09-Amortización de Elementos Patrimoniales Objeto de Reinversión de Empresas de Reducida Dimensión (DT 28ª LIS)"
      },
      {
        "value": "10",
        "label": "10-Amortización de Activos Nuevos Adquiridos en 2003 y 2004 (DT 13ª LIS)"
      }
    ],
    "c23": [
      {
        "value": "02",
        "label": "02-NIF-IVA intracomunitario"
      },
      {
        "value": "03",
        "label": "03-Pasaporte"
      },
      {
        "value": "04",
        "label": "04-Documento oficial de identificación expedido por el país o territorio de residencia."
      },
      {
        "value": "05",
        "label": "05-Certificado de Residencia."
      },
      {
        "value": "06",
        "label": "06-Otro documento probatorio."
      }
    ]
  }
};
