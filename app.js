function obtenerRefacciones() {
  return [
    { codigo: "R001", nombre: "Filtro de aceite", precio: 25.5 },
    { codigo: "R002", nombre: "Bujías", precio: 10.75 },
    { codigo: "R003", nombre: "Pastillas de freno", precio: 55.2 },
    { codigo: "R004", nombre: "Aceite de motor", precio: 18.9 },
    { codigo: "R005", nombre: "Freno de disco", precio: 120.0 },
    { codigo: "R006", nombre: "Batería de auto", precio: 90.0 },
    { codigo: "R007", nombre: "Correa de distribución", precio: 45.4 },
    { codigo: "R008", nombre: "Amortiguadores", precio: 110.0 },
    { codigo: "R009", nombre: "Radiador", precio: 140.75 },
    { codigo: "R010", nombre: "Alternador", precio: 200.0 },
    { codigo: "R011", nombre: "Termostato", precio: 15.6 },
    { codigo: "R012", nombre: "Filtro de aire", precio: 20.3 },
    { codigo: "R013", nombre: "Bombas de agua", precio: 50.0 },
    { codigo: "R014", nombre: "Cables de bujía", precio: 22.5 },
    { codigo: "R015", nombre: "Bombillas de faro", precio: 8.4 },
    { codigo: "R016", nombre: "Mangueras de radiador", precio: 14.7 },
    { codigo: "R017", nombre: "Engranajes de transmisión", precio: 75.0 },
    { codigo: "R018", nombre: "Filtro de combustible", precio: 28.2 },
    { codigo: "R019", nombre: "Lámpara de aceite", precio: 5.5 },
    { codigo: "R020", nombre: "Placa de embrague", precio: 85.0 },
    { codigo: "R021", nombre: "Aceite de transmisión", precio: 29.9 },
    { codigo: "R022", nombre: "Juntas de motor", precio: 18.0 },
    { codigo: "R023", nombre: "Fusibles", precio: 2.5 },
    { codigo: "R024", nombre: "Sensores de oxígeno", precio: 40.0 },
    { codigo: "R025", nombre: "Carter de aceite", precio: 60.0 },
  ];
}

function generar() {
  const refacciones = obtenerRefacciones();
  let sql =
    "CREATE TABLE IF NOT EXISTS refacciones (codigo VARCHAR(255) NOT NULL UNIQUE, nombre VARCHAR(255) NOT NULL, precio FLOAT(9,2) UNSIGNED NOT NULL);<br>";
  sql += `INSERT INTO refacciones (codigo, nombre, precio) VALUES <br>`;
  for (let i = 0; i < refacciones.length; i++) {
    const { codigo, nombre, precio } = refacciones[i];
    sql += `('${codigo}', '${nombre}', '${precio}'),<br>`;
  }

  sql = sql.slice(0, -5);
  sql += ";<br>";

  sql +=
    "CREATE TABLE IF NOT EXISTS ventas (id_venta INT(11) UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT, hora_venta TIME NOT NULL, fecha_venta DATE NOT NULL);<br>";

  sql += `INSERT INTO ventas (id_venta, hora_venta, fecha_venta) VALUES`;
  for (let i = 1; i < 2001; i++) {
    sql += `('${i}', '${generarHora()}', '${generarFecha()}' ),<br>`;
  }

  sql = sql.slice(0, -5);
  sql += ";<br>";

  sql += `DROP TABLE IF EXISTS ventas_detalle <br>;
  CREATE TABLE IF NOT EXISTS ventas_detalle ( id_venta INT(11) UNSIGNED NOT NULL, codigo VARCHAR(255) NOT NULL, nombre VARCHAR(255) NOT NULL,
  precio FLOAT(9,2) UNSIGNED NOT NULL);<br>`;

  sql += `INSERT INTO ventas_detalle (id_venta, codigo, nombre, precio) VALUES <br>`;

  for (let i = 1; i < 2001; i++) {
    const cantidadDetalles = obtenerNumeroAleatorio(1, 20);

    for (let j = 1; j <= cantidadDetalles; j++) {
      const { codigo, nombre, precio } =
        refacciones[obtenerNumeroAleatorio(0, refacciones.length - 1)];
      sql += `('${i}', '${codigo}', '${nombre}', '${precio}'),<br>`;
    }
    sql += `<br><br>`;
  }
  sql = sql.slice(0, -13);
  sql += ";<br>";
  document.getElementById("texto").innerHTML = sql;
}

function obtenerNumeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function descargarSQL() {
  let sql = "DROP DATABASE IF EXISTS pos;\n";
  sql +=
    "CREATE DATABASE pos CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;\n";
  sql += "USE pos;\n";
  sql += document.getElementById("texto").innerHTML.replace(/<br>/g, "\n");

  const blob = new Blob([sql], { type: "text/sql;text/plain;charset=UTF-8" });
  const url = URL.createObjectURL(blob);

  // Descargar
  const a = document.createElement("a");
  a.href = url;
  a.download = "ventas.sql";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  console.log("descargando");
}

function generarFecha() {
  const inicio = "1900-01-01";
  const fin = "2024-12-31";

  const inicioMs = new Date(inicio).getTime();
  const finMs = new Date(fin).getTime();

  const fechaAleatoriaMs = Math.random() * (finMs - inicioMs) + inicioMs;

  const currentDate = new Date(fechaAleatoriaMs);

  const anio = currentDate.getFullYear();
  const mes = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
  const dia = String(currentDate.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function generarHora() {
  const horas = Math.floor(Math.random() * 24);
  const minutos = Math.floor(Math.random() * 60);
  const segundos = Math.floor(Math.random() * 60);

  return `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
}
