
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE PLANTU;
USE PLANTU;


-- Creamos la tabla de usuarios
CREATE TABLE usuarios (
id INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(50),
correo VARCHAR(50),
contraseña VARCHAR(100),
rol VARCHAR(20)
);

CREATE TABLE categorias (
id INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(50)
);

CREATE TABLE viveros (
id INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(50),
descripcion TEXT,
imagen VARCHAR(200),
vendedor_id INT,
FOREIGN KEY (vendedor_id) REFERENCES usuarios(id)
);

CREATE TABLE plantas (
id INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(50),
descripcion TEXT,
precio DECIMAL(10, 2),
stock INT,
imagen VARCHAR(200),
vendedor_id INT,
categoria_id INT,
vivero_id INT,
FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
FOREIGN KEY (categoria_id) REFERENCES categorias(id),
FOREIGN KEY (vivero_id) REFERENCES viveros(id)
);


CREATE TABLE transacciones (
id INT PRIMARY KEY AUTO_INCREMENT,
fecha TIMESTAMP,
total DECIMAL(10, 2),
medio_pago VARCHAR(50),
comprador_id INT,
direccion_envio VARCHAR(100),
FOREIGN KEY (comprador_id) REFERENCES usuarios(id)
);

CREATE TABLE detalles_transaccion (
id INT PRIMARY KEY AUTO_INCREMENT,
transaccion_id INT,
planta_id INT,
cantidad INT,
FOREIGN KEY (transaccion_id) REFERENCES transacciones(id),
FOREIGN KEY (planta_id) REFERENCES plantas(id)
);

CREATE TABLE carro (
id INT PRIMARY KEY AUTO_INCREMENT,
usuario_id INT,
planta_id INT,
cantidad INT,
FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
FOREIGN KEY (planta_id) REFERENCES plantas(id)
);

CREATE TABLE valoraciones (
id INT PRIMARY KEY AUTO_INCREMENT,
usuario_id INT,
planta_id INT,
valoracion DECIMAL(2, 1),
comentario TEXT,
FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
FOREIGN KEY (planta_id) REFERENCES plantas(id)
);

CREATE TABLE envios (
id INT PRIMARY KEY AUTO_INCREMENT,
transaccion_id INT,
fecha_envio TIMESTAMP,
direccion_envio VARCHAR(100),
numero_seguimiento VARCHAR(50),
FOREIGN KEY (transaccion_id) REFERENCES transacciones(id)
);




CREATE TABLE soporte (
id INT PRIMARY KEY AUTO_INCREMENT,
usuario_id INT,
fecha_creacion TIMESTAMP,
estado VARCHAR(20),
descripcion TEXT,
FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);



-- Creamos la tabla de mensajes
CREATE TABLE mensajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario_emisor INT NOT NULL,
  id_usuario_receptor INT NOT NULL,
  mensaje TEXT NOT NULL,
  fecha_envio DATETIME NOT NULL,
  FOREIGN KEY (id_usuario_emisor) REFERENCES usuarios(id),
  FOREIGN KEY (id_usuario_receptor) REFERENCES usuarios(id)
);

-- Creamos la tabla de favoritos
CREATE TABLE favoritos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_planta INT NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  FOREIGN KEY (id_planta) REFERENCES plantas(id)
);

-- Creamos la tabla de historial de compras
CREATE TABLE compras (
id INT PRIMARY KEY AUTO_INCREMENT,
usuario_id INT,
planta_id INT,
fecha_compra TIMESTAMP,
precio DECIMAL(10, 2) NOT NULL,
cantidad INT,
FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
FOREIGN KEY (planta_id) REFERENCES plantas(id)
);


-- Creamos la tabla de comentarios y valoraciones
CREATE TABLE comentarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_planta INT NOT NULL,
  comentario TEXT NOT NULL,
  valoracion INT NOT NULL,
  fecha_comentario DATETIME NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  FOREIGN KEY (id_planta) REFERENCES plantas(id)
);

-- Creamos la tabla de integraciones de redes sociales
CREATE TABLE redes_sociales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  red_social VARCHAR(50) NOT NULL,
  perfil_url VARCHAR(255) NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
