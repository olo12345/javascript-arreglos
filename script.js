const escalaMayorDeDo = [ "Do", "Re", "Mi", "Fa", "Sol", "La", "Si", ]
let html = "";
let salida = document.querySelector("#dynamic-content")
for (let notas of escalaMayorDeDo)
{ html += `${notas}` }
salida.innerHTML = html

