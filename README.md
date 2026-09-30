# Carrera de Caracoles

Aplicación web full-stack desarrollada con React, TypeScript y Express. El proyecto simula una plataforma de carreras de caracoles con autenticación de usuarios, administración de saldo, pagos simulados mediante SnailPay y estadísticas de carreras.

## Tecnologías

### Frontend

* React
* TypeScript
* Vite
* Recharts
* LocalStorage
* Web Crypto API

### Backend

* Node.js
* Express
* TypeScript
* Vitest
* CORS

## Arquitectura

El proyecto está dividido en dos aplicaciones independientes:

```text
carrera_caracoles/
├── frontend/
│   └── React + TypeScript
│
├── backend/
│   └── Express + TypeScript
│
└── README.md
```

El frontend se encarga de la interfaz de usuario, el flujo de autenticación, la persistencia local y la visualización de estadísticas.

El backend expone la API de simulación de SnailPay y contiene la validación y lógica de procesamiento de las transacciones.

## Requisitos

* Node.js 22+
* npm 10+

## Instalación

Las dependencias se instalan de forma independiente para frontend y backend.

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Ejecución

El frontend y el backend se ejecutan de manera independiente.

### 1. Iniciar el backend

En una terminal:

```bash
cd backend
npm run dev
```

La API estará disponible en:

```text
http://localhost:3000
```

Health check:

```text
GET http://localhost:3000/api/health
```

### 2. Iniciar el frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

Vite mostrará la URL local en la terminal, normalmente:

```text
http://localhost:5173
```

## Autenticación

La aplicación permite:

* Crear una cuenta.
* Iniciar sesión.
* Cerrar sesión.
* Mantener la sesión después de recargar la página.
* Validar los datos de registro e inicio de sesión.
* Alternar entre las vistas de registro e inicio de sesión.

La aplicación utiliza LocalStorage debido a que se trata de una simulación local.

Las contraseñas no se almacenan en texto plano. Antes de guardar los datos del usuario se genera un hash mediante PBKDF2 con SHA-256, utilizando un salt aleatorio por usuario y la Web Crypto API.

La simulación mantiene un único usuario local por navegador. Registrar un nuevo usuario reemplaza la cuenta local anterior, ya que el alcance del challenge no requiere múltiples usuarios ni un backend de autenticación persistente.

> Este mecanismo está diseñado para el alcance del challenge y no pretende sustituir un sistema de autenticación de producción. En un entorno real, la autenticación y el almacenamiento de credenciales deberían gestionarse del lado del servidor utilizando mecanismos como Argon2, scrypt o bcrypt.

## Dashboard

Después de iniciar sesión, el dashboard muestra:

* Usuario actual.
* Saldo disponible.
* Estadísticas simuladas de apuestas.
* Victorias de los caracoles.
* Seis carreras simuladas.
* Formulario de pago SnailPay.
* Opción para cerrar sesión.

Los datos de carreras y apuestas son simulados y representan seis caracoles compitiendo en seis carreras.

## SnailPay

El frontend se comunica con la API de Express mediante:

```text
POST /api/snailpay/transactions
```

La API recibe:

* Número de tarjeta.
* Fecha de vencimiento.
* CVV.
* Nombre del titular.
* Monto.
* ID del usuario.
* Correo electrónico del pagador.

### Pago aprobado

Utilizar los siguientes datos ficticios:

```text
Tarjeta:       1234123412341234
Vencimiento:   12/26
CVV:           543
Nombre:        Cualquier nombre no vacío
Monto:         Cualquier monto mayor a 0
```

Resultado esperado:

```text
status: approved
```

El saldo del usuario se incrementa y se persiste en LocalStorage.

### Pago rechazado

Se puede utilizar, por ejemplo:

```text
Tarjeta:       1111222233334444
Vencimiento:   12/26
CVV:           543
Nombre:        Cualquier nombre no vacío
Monto:         500
```

Resultado esperado:

```text
status: rejected
```

El saldo no se modifica.

### Error interno simulado

Utilizar:

```text
Tarjeta:       9999999999999999
Vencimiento:   12/26
CVV:           543
Nombre:        Cualquier nombre no vacío
Monto:         500
```

Resultado esperado:

```text
status: error
```

El saldo no se modifica.

### Error global del sistema

El backend permite forzar un error interno mediante una variable de entorno para facilitar la reproducción y prueba del escenario:

```bash
SNAILPAY_FORCE_ERROR=true
```

Con esta variable activa, cualquier transacción procesada por SnailPay devuelve:

```text
status: error
```

sin modificar el saldo del usuario.

En PowerShell:

```powershell
$env:SNAILPAY_FORCE_ERROR="true"
npm run dev
```

Para desactivar el escenario:

```powershell
Remove-Item Env:SNAILPAY_FORCE_ERROR
```

Después de modificar la variable de entorno, se debe reiniciar el backend.

### Timeout simulado

Utilizar:

```text
Tarjeta:       8888888888888888
Vencimiento:   12/26
CVV:           543
Nombre:        Cualquier nombre no vacío
Monto:         500
```

El backend retrasa intencionalmente la respuesta durante 11 segundos, mientras que el frontend tiene configurado un timeout de 10 segundos.

El frontend aborta la solicitud después de 10 segundos y muestra:

```text
La solicitud a SnailPay excedió el tiempo de espera. Intenta nuevamente.
```

Si se consume directamente el endpoint, el backend responde con HTTP 504 después de los 11 segundos.

El saldo no se modifica.

## Persistencia

La aplicación utiliza LocalStorage para la simulación local de:

* Usuario registrado.
* Sesión activa.
* Saldo.
* Datos de tarjeta utilizados en un pago exitoso.

Los datos de tarjeta utilizados por la aplicación son completamente ficticios y existen únicamente para cumplir con la simulación solicitada.

En un sistema de pagos real, los datos sensibles deben ser gestionados por un proveedor de pagos que cumpla con los estándares correspondientes. En particular, el CVV no debe almacenarse de forma persistente.

## Validación y manejo de errores

El backend valida la estructura y los tipos de los datos recibidos antes de procesar una transacción.

La aplicación contempla:

* Solicitudes con datos inválidos.
* Número de tarjeta incorrecto.
* Fecha de vencimiento incorrecta.
* CVV incorrecto.
* Nombre del titular vacío.
* Monto inválido.
* Error interno simulado.
* Timeout de la solicitud.

Las solicitudes con datos inválidos reciben HTTP 400 y mantienen una estructura de respuesta consistente de SnailPay, incluyendo identificador, estado, detalle, monto, fecha, referencia y datos del pagador.

Las respuestas de SnailPay mantienen una estructura consistente para operaciones aprobadas, rechazadas, errores internos, timeouts y solicitudes inválidas. Incluyen información como:

* ID de transacción.
* Estado.
* Detalle del estado.
* Monto.
* Fecha de creación.
* Código de autorización.
* Referencia.
* ID del pagador.
* Correo del pagador.
* Datos ficticios de tarjeta utilizados en la simulación.

Los errores de procesamiento no incrementan el saldo del usuario.

## Pruebas

El backend cuenta con pruebas unitarias utilizando Vitest.

Para ejecutar las pruebas:

```bash
cd backend
npm test
```

Para compilar el backend:

```bash
npm run build
```

Para compilar el frontend:

```bash
cd frontend
npm run build
```

Además de las pruebas unitarias, se realizaron verificaciones manuales de:

* Registro e inicio de sesión.
* Persistencia de sesión después de recargar.
* Cierre de sesión.
* Pago aprobado.
* Pago rechazado.
* Error interno.
* Error global mediante `SNAILPAY_FORCE_ERROR`.
* Timeout del frontend.
* Respuesta HTTP 504 del backend.
* Solicitudes inválidas con respuesta HTTP 400.
* Persistencia del saldo después de un pago aprobado.

## Uso de herramientas de IA

Durante el desarrollo se utilizaron herramientas de IA como apoyo para:

* Explorar alternativas de implementación.
* Redactar y revisar código.
* Identificar oportunidades de validación y manejo de errores.
* Revisar la organización y arquitectura del proyecto.
* Apoyar la creación y revisión de pruebas.
* Analizar posibles mejoras de calidad y seguridad.

El código generado o sugerido fue revisado, adaptado y probado manualmente durante el desarrollo. Las decisiones finales de implementación fueron verificadas mediante pruebas automatizadas y pruebas manuales.

## Estructura del proyecto

```text
carrera_caracoles/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   └── tests/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── types/
│       └── utils/
│
├── .gitignore
└── README.md
```
