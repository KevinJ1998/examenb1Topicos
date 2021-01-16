El proyecto consiste en un chat básico con inicio de sesión, donde el usuario puede registarse con correo y contraseña. En el chat se mostrará
la persona que envió el mensaje junto con el texto enviado, además de la opción de envío de imágenes. Todos estos datos serán encriptados y
enviados a una base de datos en Firebase (Real Time DataBase). Cabe recalcar que para la opción de imágenes la aplicación debe ejecutarse en un
dispositivo simulador o real, ya sea Android o iOS.

Para este proyecto, se hizo uso de las herramientas: 
 - Ionic Frameowrk en la versión 5
 - Firebase
 - CryptoJS para la ecnriptación de datos
 - Cordova Plugin Camera para el manejo de las fotos
 
Los métodos usados para inicio de sesión, lectura, escritura de datos en la base, son los básicos que proporciona Firebase en la documentación.
Como por ejemplo para el logIn se usó la función ``signInWithEmailAndPassword()``, para el caso de logOut ``signOut()``, etc.
Por otro lado para la lectura y escritura de datos se utilizaron las funciones de AngularFireDatabase.
Para escribir datos que en este caso es para enviar un mensaje la función usada es ``AngularFireDatabase.list('path').push(mensaje)``

y para el caso de leer los datos ``AngularFireDatabase.database.ref('path')``.
Y para la encriptación de datos se tomo en cuenta las opciones brindadas en la documentación de CryptoJS https://cryptojs.gitbook.io/docs/

Todo esto se lo explica en el siguiente video: 
https://youtu.be/z_mPVnEJeyM
 
Si se quiere ver el proyecto se lo puede hacer de la siguiente manera:
 - Descargar o clonar el repositorio
 - Ejecutar ``npm install``
 - Ingresar a la carpeta del proyecto y ejecutar ``ionic serve``.
 
En caso de querer probar el proyecto en un dispositivo Android se puede descargar la apk desde el siguiente link:
https://drive.google.com/file/d/1umlvw6fFafZyAmJlpuhcu9HUlEleatZc/view?usp=sharing

