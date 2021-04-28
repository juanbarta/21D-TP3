new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
        cantidadCuracion: 10,
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true;
            this.saludJugador = 100;
            this.saludMonstruo = 100;
            this.turnos = [];
        },
        atacar: function () {
            let danio = this.calcularHeridas(this.rangoAtaque);
            this.saludMonstruo -= danio;
            this.registrarEvento({
                esJugador: true,
                text: `El jugador usa ATACAR sobre monstruo por ${danio}`,
            });
            if (this.verificarGanador()){
                return;
            }
            this.ataqueDelMonstruo();
        },

        ataqueEspecial: function () {
            let danio = this.calcularHeridas(this.rangoAtaqueEspecial);
            this.saludMonstruo -= danio;
            this.registrarEvento({
                esJugador: true,
                text: `El jugador usa ATAQUE ESPECIAL sobre monstruo por ${danio}`,
            });
            if (this.verificarGanador()){
                return;
            }
            this.ataqueDelMonstruo();
        },

        curar: function () {
            if (this.saludJugador <= 90){
                this.saludJugador += this.cantidadCuracion;
            }
            else{
                this.saludJugador = 100;
            }
            this.registrarEvento({
                esJugador: true,
                text: `El jugador usa CURAR por ${this.cantidadCuracion}`,
            });
            this.ataqueDelMonstruo();
        },

        registrarEvento(evento) {
            this.turnos.unshift(evento);
        },
        terminarPartida: function () {
            this.registrarEvento({
                esJugador: true,
                text: `El jugador se rinde.`,
            });
            this.hayUnaPartidaEnJuego = false;
        },

        ataqueDelMonstruo: function () {
            let danio = this.calcularHeridas(this.rangoAtaqueDelMonstruo);
            this.saludJugador -= danio;
            this.registrarEvento({
                esJugador: false,
                text: `El monstruo usa ATACAR sobre el jugador por ${danio}`,
            });
            this.verificarGanador();

        },

        calcularHeridas: function (rango) {
            let min = rango[0];
            let max = rango[1];
            return Math.max(Math.floor(Math.random() * max) + 1, min)

        },
        verificarGanador: function () {
            if (this.saludMonstruo <= 0){
                if (confirm('Ganaste! Quieres jugar de nuevo?')){
                    this.empezarPartida();
                }else{
                    this.hayUnaPartidaEnJuego = false;
                }
                return true;
            }else if (this.saludJugador <= 0){
                if (confirm('Perdiste! Quieres jugar de nuevo?')){
                    this.empezarPartida();
                }else{
                    this.hayUnaPartidaEnJuego = false;
                }
                return true;
            }
            return false;
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});