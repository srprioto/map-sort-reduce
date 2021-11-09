document.getElementById('file-input').addEventListener('change', leerAr, false);

let dataMap = [];
let dataShuf = [];
let dataRed = [];

function leerAr(e) {

    const lector = new FileReader();

    const archivo = e.target.files[0];
    if (!archivo) return;

    lector.onload = e => { 
        let contenido = e.target.result;
        main(contenido);
        mostrarBoton();
    };

    lector.readAsText(archivo);
    
}


function mostrarBoton() {
    const botonMostrar = document.getElementById('box-mostrar');
    botonMostrar.style.display = 'block';
}


function main(contenido) {
    const mreduce = new MapReduce(contenido);
    dataMap = mreduce.mapping();
    dataShuf = mreduce.shuffling();
    dataRed = mreduce.reducing();

    document.getElementById('mostrar').addEventListener('click', () => { 

        const iDataMap = () => {
            let i = 0;
            let template = '';
            dataMap.forEach((info) => { 
                template += `
                    <p class="clave">${i++}</p><span>:</span> <p class="valor">"${info}"<span>,</span></p><br>
        
                `
            })
            return template;
        }


        const iDataShuf = () => { 

            let i = 0;
            let template = '';

            dataShuf.forEach((info) => { 
                template += `
                    <p class="clave">${i++}</p><span> : { 

                        <p class="valor">
                            <span class="nombre">palabra : </span> "${info.palabra}"
                        </p> 
                    
                    
                    }<span>,</span> </span><br>
        
                `
            })

            return template;

        }

        const iDataReduce = () => { 

            let i = 0;
            let template = '';

            dataRed.forEach((info) => { 
                template += `
                    <p class="clave">${i++}</p><span> : { <br>

                        <p class="valor">
                            <span class="nombre">palabra : </span> "${info.palabra}"<span>,</span><br>
                            <span class="nombre">cantidad : </span> <span class="numero">${info.cantidad}</span><br>
                        </p> 
                    
                    
                    }, </span><br>
        
                `
            })

            return template;

        }


        document.getElementById('resultado').innerHTML = `

            <div class="result-grid">

                <div class="info-archivo">
                    <span id="contenido-archivo" class="box-content">
                        ${contenido.replace(/\r?\n/g,"<br>")}
                    </span>
                </div>

                <div class="mapping">
                    [
                        <div class="tab">${iDataMap()}</div>
                    ]
                </div>

                <div class="shuffling">
                    [
                        <div class="tab">${iDataShuf()}</div>
                    ]
                </div>

                <div class="reducing">
                    [
                        <div class="tab">${iDataReduce()}</div>
                    ]
                </div>


            </div>


        `;

        console.log(dataMap);
        console.log(dataShuf);
        console.log(dataRed);
    
        let i = 0;
    
        let template = '';
    
        dataMap.forEach((info) => { 
            template += `
                <li>${i++} - ${info}</li>
    
            `
        })
    
        // document.getElementById('objeto').innerHTML = template;

        const target = document.getElementById("resultado");
        animate(document.scrollingElement || document.documentElement, "scrollTop", "", 0, target.offsetTop, 500, true);

    }, false)

}


function animate(elem, style, unit, from, to, time, prop) {
    if (!elem) {
        return;
    }
    let start = new Date().getTime(),
        timer = setInterval(function () {
            let step = Math.min(1, (new Date().getTime() - start) / time);
            if (prop) {
                elem[style] = (from + step * (to - from))+unit;
            } else {
                elem.style[style] = (from + step * (to - from))+unit;
            }
            if (step === 1) {
                clearInterval(timer);
            }
        }, 25);
    if (prop) {
          elem[style] = from+unit;
    } else {
          elem.style[style] = from+unit;
    }
}




// --- MapReduce ---
class MapReduce{

    constructor(contenido) {

        this.contenido = contenido;

        this.numeroPalabras = 0;
        this.textoArray = [];

        this.textoMapping = [];
        this.textoShuffling = [];
        this.textoReducing = [];

        this.procesarPalabras();
        
    }

    mapping(){

        this.textoArray.map(palabra => {
            // this.textoMapping.push(this.invertirObjeto({ 1: palabra }))
            this.textoMapping.push({ 
                palabra: palabra.toLowerCase(),
                cantidad: 1 
            })
        });

        // console.log("mapping");
        // console.log(this.textoArray);

        return this.textoArray;

    }

    

    shuffling(){
        
        this.textoShuffling = this.textoMapping.sort((a, b) => {
            if (a.palabra > b.palabra) return 1;
            if (a.palabra < b.palabra) return -1;
            return 0;
        })

        // console.log("shuffling");
        // console.log(this.textoShuffling);

        return this.textoShuffling;

    }


    reducing(){

        this.textoReducing = this.textoShuffling.reduce((acumulador, valorActual) => {

            const elementoYaExiste = acumulador.find(elemento => elemento.palabra === valorActual.palabra);

            if (elementoYaExiste) {
                return acumulador.map((elemento) => {
                    
                    if (elemento.palabra === valorActual.palabra) {
                        return {
                            ...elemento,
                            cantidad: elemento.cantidad + valorActual.cantidad
                        }
                    }
    
                    return elemento;
                });
            }
    
            return [...acumulador, valorActual];

        }, []);
    
        // console.log("reducing");
        // console.log(this.textoReducing);

        return this.textoReducing;

    }




    procesarPalabras(){
        let texto = this.contenido;

        texto = texto.replace(/\r?\n/g," ");
        texto = texto.replace(/[ ]+/g," ");
        texto = texto.replace(/^ /,"");
        texto = texto.replace(/ $/,"");
        texto = texto.replace(/,/g, "");
        texto = texto.replace(/\. /g, "");

        this.textoArray = texto.split(" ");
        this.numeroPalabras = this.textoArray.length;

    }

    invertirObjeto(obj){
        let retobj = {};
        for(let key in obj){
          retobj[obj[key]] = parseInt(key);
        }
        return retobj;
    }
        

}











