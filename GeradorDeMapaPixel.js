var GeradorDeMapaPixel = {
		ESCREVE : false,
        //quantidade de frames
        qtd: 5,
        //Altura de cada frame
        altura: 10,
        //Largura de cada frame
        largura: 10,
        //mapa de cor
        mapaCor: {
            "1": "rgb(000,000,000)",
            "0": "rgb(255,255,255)"
        },
        animacaoAtiva: false,
        $matFrame: [],
        //[frame][altura][largura]
        $selectMapaCorAtiva: $("<select />"),
        $saidaInput: $("<div />"),
        //==================carrega select da cor ativa
        carregaSelectCorAtiva: function() {
            var that = this;
            $.each(this.mapaCor, function(propriedade, valor) {
                var $op = $("<option />", {
                    "css": {
                        "background-color": valor
                    },
                    "value": propriedade,
                    "text": propriedade
                });
                if (propriedade == 1) {
                    $op.attr("selected", "selected");
                }
                that.$selectMapaCorAtiva.append($op);
            });
        },
        //=============gera os inputs
        geraInputs: function(c) {
            $.extend(this, c);
            this.animacaoAtiva = false;
            this.$selectMapaCorAtiva.html("");
            this.$saidaInput.html("");
            this.carregaSelectCorAtiva();
            this.$saidaInput.append("Mapa cor ativa:").append(this.$selectMapaCorAtiva).append("<br />Faça o desenho:");
            var that = this;
            var $div = $("<div  />", {
                "class": "listaInputs"
            });
            this.$matFrame = [];
            for (var i = 0; i < this.qtd; i++) {
                var $itemDiv = $("<div   />", {
                    "css": {
                        "float": "left",
                        "margin": "15px"
                    }
                });
                this.$matFrame[i] = [];
                for (var j = 0; j < this.altura; j++) {
                    this.$matFrame[i][j] = [];
                    for (var k = 0; k < this.largura; k++) {
                        this.$matFrame[i][j][k] = $("<input />", {
                            "readonly": "readyonly",
                            "css": {
                                "cursor": "pointer",
                                "width": "15px",
                                "margin": 0
                            },
                            "value": 0,
                            "click": function() {
                                $(this).trigger("mouseenter", ["click"]);
                            },
                            "mouseenter": function(event, c) {
                                if (!that.ESCREVE && c != "click") {
                                    return;
                                }
                                // if ($(this).val() == 0) {
                                $(this).val(that.$selectMapaCorAtiva.val());
                                $(this).css({
                                    "background-color": that.mapaCor[that.$selectMapaCorAtiva.val()]
                                });
                                //} else {
                                //  $(this).val(0);
                                //$(this).css({
                                //   "background-color": "#fff"
                                //    });
                                //  }
                            } //click
                        }).appendTo($itemDiv);
                    } //k
                    $itemDiv.append("<div />");
                } //j
                $div.append($itemDiv);
            } //i
            this.$saidaInput.append($div).append("<div style='clear:both'></div><hr />Passo 2:");

            var $btnGerarStringMatriz = $("<button />", {
                "html": "Gerar Matriz",
                "click": function() {
                    that.geraMatrizString();
                }
            }).appendTo(this.$saidaInput);

            var $btnExecutarAnimacao = $("<button />", {
                "html": "Executar Animação",
                "click": function() {
                    that.executarAnimacao();
                }
            }).appendTo(this.$saidaInput.append(" ou "));

        },
        //-
        geraMatrizString: function() {
            var str = "[";
            //cada frame
            for (var i = 0; i < this.$matFrame.length; i++) {
                if (i > 0) {
                    str += ",";
                }
                str += "<br />&nbsp;&nbsp;&nbsp;[ ";
                //altura
                for (var j = 0; j < this.$matFrame[i].length; j++) {
                    if (j > 0) {
                        str += ",";
                    }
                    str += "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ ";
                    //largura
                    for (var k = 0; k < this.$matFrame[i][j].length; k++) {
                        if (k > 0) {
                            str += ",";
                        }
                        str += "<div style='text-align:center;display:inline-block;width:15px;height:15px'>";
                        str += this.$matFrame[i][j][k].val() + "</div>";
                    } //k
                    str += "]";
                } //j
                str += "<br />&nbsp;&nbsp;&nbsp;]";
            } //i
            str += "<br />&nbsp;]";
            var op = open("", "");
            op.document.write("<div style='font-size:11px'>var mat =<br /> " + str + ";</div>");
        },
        //
        //executarAnimacao
        executarAnimacao: function() {
            var ALTURA = 10;
            var LARGURA = 10;
            var ESPACO = 0;
            var L = (LARGURA + ESPACO) * this.largura;
            var A = (ALTURA + ESPACO) * this.altura;
            var op = open("", "canvas" + (new Date()).getTime(), "toolbar=0,status=0,resizable=1,location=0,scrollbars=0");
            op.resizeTo(L + 100, A + 110);
            var canvas = document.createElement("canvas");
            $(canvas).css({
                "border": "1px solid #000"
            });
            op.document.write("<html><head></head><body ></body></html>");
            $(op.document.body).append(canvas);

            canvas.width = L;
            canvas.height = A;
            var tela = canvas.getContext("2d");
            var that = this;
            var frame = 0;
            //loop da animacao do canvas
            var loop = function() {
                if (contFrame == 5) {
                    contFrame = 0;
                    tela.clearRect(0, 0, L, A);
                    tela.fillStyle = 'rgba(255,255,255,0)';
                    tela.fillRect(0, 0, L, A);
                    for (var i = 0; i < that.$matFrame[frame].length; i++) {
                        for (var j = 0; j < that.$matFrame[frame][i].length; j++) {
                            tela.fillStyle = that.mapaCor[that.$matFrame[frame][i][j].val()];
                            tela.fillRect(j * (LARGURA + ESPACO), i * (ALTURA + ESPACO), LARGURA, ALTURA);
                        }
                    }
                    frame = (frame + 1) % that.$matFrame.length;
                }
                contFrame++;
                if (that.animacaoAtiva) {
                    requestAnimFrame(loop);
                }
            }; //loop
            that.animacaoAtiva = true;
            var contFrame = 0;
            loop();
        } //executarAnimacao
    }; //fim
	
	//========
	//=======padroniza o requestAnimFrame 
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || // padrao html5
    window.webkitRequestAnimationFrame || //chrome ou safari
    window.mozRequestAnimationFrame || //firefox
    window.oRequestAnimationFrame || //opera
    window.msRequestAnimationFrame || // m$

    function(callback, element) { ////para navegadores antigos
        window.setTimeout(function() {
            callback(+new Date);
        }, 1000 / 60);
    };
})();