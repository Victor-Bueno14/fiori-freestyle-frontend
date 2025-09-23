sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("zov.controller.CreateOvView", {
        //Métodos do framework[->]
        onInit: function() {

            const oView = this.getView();

            const oDate = new Date();

            const sDate = oDate.toLocaleDateString("pt-BR");

            const sUser = sap.ushell.Container.getService("UserInfo").getId();

            oView.byId("dataCriacaoCreate").setValue(sDate);
        },
        //Métodos do framework[<-]
        onChange: function () {
            const oView = this.getView();

            let iTotalItems = Number(oView.byId("totalItensCreate").getValue());
            let iTotalFreight = Number(oView.byId("totalFreteCreate").getValue());

            let iTotalOrdem = iTotalItems + iTotalFreight;

            oView.byId("totalOrdemCreate").setValue(iTotalOrdem);
        },

        onCreate: function () {
            const oData= {};

            const oView = this.getView();

            oData.CriadoPor = oView.byId("criadoPorCreate").getValue();
            oData.ClienteId = parseFloat(oView.byId("clienteIdCreate").getValue());
            oData.TotalItens = oView.byId("totalItensCreate").getValue();
            oData.TotalFrete = oView.byId("totalFreteCreate").getValue();
            oData.TotalOrdem = oView.byId("totalOrdemCreate").getValue();
            oData.Status = oView.byId("statusOrdemCreate").getValue();

            if (oData.ClienteId === "" || oData.TotalItens === "" || oData.TotalFrete === "" || oData.Status === "") {
                MessageToast.show("Preencha todos os campos!");
            } else {

                this.create(oData);
            };
        },

        onClean: function () {
            const oView = this.getView();

            oView.byId("clienteIdCreate").setValue("");
            oView.byId("totalItensCreate").setValue("");
            oView.byId("totalFreteCreate").setValue("");
            oView.byId("statusOrdemCreate").setValue("");
            oView.byId("totalOrdemCreate").setValue(0);

        },

        create: function(oData) {
            const oView = this.getView();
            const oModel = this.getOwnerComponent().getModel();

            oView.setBusy(true);

            oModel.create("/OVCabSet", oData, {
                success: function (oData2, oResponse) {
                    oView.setBusy(false);

                    if(oResponse.statusCode == 201) {
                        oView.byId("ordemIdCreate").setValue(oData2.OrdemId);
                        oView.byId("totalOrdemCreate").setValue(oData2.TotalOrdem);
                        MessageToast.show("Ordem Cadastrada com Sucesso");
                    } else {
                        MessageToast.show("Erro no Cadastro");
                    }
                },
                error: function (oError) {
                    oView.setBusy(false);

                    const oObj = JSON.parse(oError.responseText);

                    MessageToast.show(oObj.error.message.value);
                }
            })
        }
    });
});