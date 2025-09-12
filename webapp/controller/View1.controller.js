sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {
        //Métodos do framework[->]
        onInit: function() {
        },
        //Métodos do framework[<-]

        onCreateOv: function() {
            const oData = {
                ClienteId: 1,
                TotalItens: "100.00",
                TotalFrete: "10.00",
                TotalOrdem: "110.00",
                Status: "N"
            };

            this.create(oData);
        },

        onCreateOvDeep: function() {
            const oData = {
                ClienteId: 1,
                TotalItens: "100.00",
                TotalFrete: "10.00",
                TotalOrdem: "110.00",
                Status: "N",
                toOVItem:[ 
                    {
                        "ItemId": 1,
                        "Material": "100",
                        "Descricao": "Mouse",
                        "Quantidade": 1,
                        "PrecoUni": "1.00",
                        "PrecoTot": "1.00"
                    },
                    {
                        "ItemId": 2,
                        "Material": "200",
                        "Descricao" : "Teclado",
                        "Quantidade": 2,
                        "PrecoUni": "5.00",
                        "PrecoTot": "10.00"
                    }
                ]
            }

            this.create(oData);
        },

        onReadOv: function() {
            const iOrdemId = this.getView().byId("lastOrder").getValue();

            if (iOrdemId == 0) {
                MessageToast.show("Crie um cabeçalho de ordem primeiro");

                return;
            };

            this.read(iOrdemId)

        },

        onUpdateOv: function() {
            const iOrdemId = this.getView().byId("lastOrder").getValue();

            if (iOrdemId == 0) {
                MessageToast.show("Crie um cabeçalho de ordem primeiro");
            } else {
                const oData = {
                    ClienteId: 2,
                    TotalItens: "150.00",
                    TotalFrete: "10.00",
                    TotalOrdem: "160.00",
                    Status: "C"
                };

                this.update(iOrdemId, oData);
            }
        },

        onDeleteOv: function() {
            const iOrdemId = this.getView().byId("lastOrder").getValue();
            console.log(iOrdemId);

            if (iOrdemId == 0) {
                MessageToast.show("Crie um cabeçalho de ordem primeiro");
            } else {
                this.delete(iOrdemId);
            }
        },

        create: function(oData) {
            const that = this; //Referência do Controller dentro de funções de callback.
            const oModel = this.getOwnerComponent().getModel();

            this.getView().setBusy(true); //Bloquear a Interface

            oModel.create("/OVCabSet", oData, {
                success: function(oData2, oResponse) {
                    that.getView().setBusy(false); //Desbloquear a Interface

                    console.log(oData2);
                    console.log(oResponse);

                    if(oResponse.statusCode == 201) {
                        that.getView().byId("lastOrder").setValue(oData2.OrdemId);
                        that.getView().byId("textArea1").setValue(JSON.stringify(oData2));

                        MessageToast.show("Cadastrado com sucesso");
                    } else {
                        MessageToast.show("Erro no cadastro");
                    }
                },
                error: function(oError) {
                    that.getView().setBusy(false); //Desbloquear a Interface

                    console.logo(oError);

                    const oObj = JSON.parse(oError.responseText);
                    MessageToast.show(oObj.error.message.value);
                }
            })
        },

        read: function(iOrdemId) {
            const that = this;
            const oModel = this.getOwnerComponent().getModel();

            this.getView().setBusy(true);

            oModel.read("/OVCabSet(" + iOrdemId + ")",{
                success: function(oData2, oResponse) {
                    that.getView().setBusy(false);

                    that.getView().byId("textArea1").setValue(JSON.stringify(oData2));

                    console.log(oData2);
                    console.log(oResponse);

                    MessageToast.show("Leitura realizada");
                },
                error: function(oError) {
                    that.getView().setBusy(false);

                    console.log(oError);

                    const oObj = JSON.parse(oError.responseText);

                    MessageToast.show(oObj.error.message.value);
                }
            })
        },

        update: function(iOrdemId, oData) {
            const that = this;
            const oModel = this.getOwnerComponent().getModel();

            this.getView().setBusy(true);

            oModel.update("/OVCabSet(" + iOrdemId + ")", oData, {
                success: function(oData2, oResponse) {
                    that.getView().setBusy(false);

                    console.log(oData2);
                    console.log(oResponse);

                    if(oResponse.statusCode == 200) {
                        that.getView().byId("textArea1").setValue(JSON.stringify(oData2));

                        MessageToast.show("Atualizado com sucesso");
                    } else {
                        MessageToast.show("Erro ao atualizar");
                    }
                },
                error: function(oError) {
                    that.getView().setBusy(false);

                    console.log(oError);

                    const oObj = JSON.parse(oError.responseText);

                    MessageToast.show(oObj.error.message.value);
                }
            })
        },

        delete: function (iOrdemId) {
            const that = this;
            const oModel = this.getOwnerComponent().getModel();

            this.getView().setBusy(true);

            oModel.remove("/OVCabSet(" + iOrdemId + ")", {
                success: function (oData2, oResponse) {
                    that.getView().setBusy(false);

                    console.log(oData2);
                    console.log(oResponse);

                    if (oResponse.statusCode == 200 || oResponse.statusCode == 204) {
                        MessageToast.show("Deletado com sucesso");

                        that.getView().byId("textArea1").setValue(JSON.stringify(oData2));
                    } else {
                        MessageToast.show("Erro ao deletar");
                    }
                },
                error: function(oError){
                    that.getView().setBusy(false);

                    console.log(oError);

                    var oObj = JSON.parse(oError.responseText);

                    MessageToast.show(oObj.error.message.value);
                }
            })
        }
    });
});