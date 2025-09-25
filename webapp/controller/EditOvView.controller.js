sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("zov.controller.EditOvView", {
        //Métodos do framework[->]
        onInit: function() {
        },
        //Métodos do framework[<-]

        onSearch: function () {
            const oView = this.getView();

            const iOrdemId = oView.byId("ordemIdEdit").getValue();

            if (iOrdemId === "") {
                MessageToast.show("Insira uma Ordem de Venda");
            } else {
                this.read(iOrdemId);
            }
        },

        onEdit: function () {
            const oData = {}

            const oView = this.getView();

            const iOrdemId = oView.byId("ordemIdEdit").getValue();

            oData.CriadoPor = oView.byId("criadoPorEdit").getValue();
            oData.ClienteId = parseFloat(oView.byId("clienteIdEdit").getValue());
            oData.TotalItens = oView.byId("totalItensEdit").getValue();
            oData.TotalFrete = oView.byId("totalFreteEdit").getValue();
            oData.TotalOrdem = oView.byId("totalOrdemEdit").getValue();
            oData.Status = oView.byId("statusOrdemEdit").getValue();

            if ( 
                oData.CriadoPor === "" || 
                oData.ClienteId === "" || 
                oData.TotalItens === "" || 
                oData.TotalFrete === "" ||
                oData.TotalOrdem === "" || 
                oData.Status === ""
            ){
                MessageToast.show("Preencha todos os campos");
             } else {
                this.edit(oData, iOrdemId);
             }
        },

        onClean: function () {
            const oView = this.getView();

            oView.byId("ordemIdEdit").setValue("");
            oView.byId("criadoPorEdit").setValue("");
            oView.byId("clienteIdEdit").setValue("");
            oView.byId("totalItensEdit").setValue("");
            oView.byId("totalFreteEdit").setValue("");
            oView.byId("totalOrdemEdit").setValue("");
            oView.byId("statusOrdemEdit").setValue("");
        },

        onChange: function () {
            const oView = this.getView();

            let iTotalItems = oView.byId("totalItensEdit").getValue();
            let iTotalFreight = oView.byId("totalFreteEdit").getValue();

            iTotalItems = iTotalItems.replace(",", ".");
            iTotalFreight = iTotalFreight.replace(",",".");

            const iTotalOrdem = Number(iTotalItems) + Number(iTotalFreight);

            oView.byId("totalOrdemEdit").setValue(iTotalOrdem);
        },

        read: function (iOrdemId) {
            const oView = this.getView();
            const oModel = this.getOwnerComponent().getModel();

            oView.setBusy(true);

            oModel.read("/OVCabSet(" + iOrdemId + ")", {
                success: function (oData2) {
                    oView.setBusy(false);

                    const oCreatedBy = oView.byId("criadoPorEdit");
                    const oClientId = oView.byId("clienteIdEdit");
                    const oTotalItems = oView.byId("totalItensEdit");
                    const oTotalFreight = oView.byId("totalFreteEdit");
                    const oTotalOrdem = oView.byId("totalOrdemEdit");
                    const oStatus = oView.byId("statusOrdemEdit");

                    oCreatedBy.setValue(oData2.CriadoPor);
                    oClientId.setValue(oData2.ClienteId);
                    oTotalItems.setValue(oData2.TotalItens);
                    oTotalFreight.setValue(oData2.TotalFrete);
                    oTotalOrdem.setValue(oData2.TotalOrdem);
                    oStatus.setValue(oData2.Status);

                    oCreatedBy.setEditable(true);
                    oClientId.setEditable(true);
                    oTotalItems.setEditable(true);
                    oTotalFreight.setEditable(true);
                    oStatus.setEditable(true);

                    MessageToast.show("Ordem de Venda Encontrada com Sucesso");
                },
                error: function(oError) {
                    oView.setBusy(false);

                    if(oError.statusCode == 404) {
                        MessageToast.show("Ordem de Venda Não Encontrada");
                    } else {
                        const oObj = JSON.parse(oError.responseText);
                        
                        MessageToast.show(oObj.error.message.value);
                    };
                }
            })
        },

        edit: function (oData, iOrdemId) {
            const oView = this.getView();
            const oModel = this.getOwnerComponent().getModel();
            
            oView.setBusy(true);

            oModel.update("/OVCabSet(" + iOrdemId + ")", oData, {
                success: function (oData2, oResponse){
                    oView.setBusy(false);

                    if(oResponse.statusCode == 200 || oResponse.statusCode == 204) {
                        oView.byId("criadoPorEdit").setEditable(false);
                        oView.byId("clienteIdEdit").setEditable(false);
                        oView.byId("totalItensEdit").setEditable(false);
                        oView.byId("totalFreteEdit").setEditable(false);
                        oView.byId("statusOrdemEdit").setEditable(false);

                        MessageToast.show("Ordem Modificada com Sucesso");
                    } else {
                        MessageToast.show("Erro ao Atualizar a Ordem de Venda");
                    }
                },
                error: function (oError){
                    oView.setBusy(false);

                    const oObj = JSON.parse(oError.responseText);

                    MessageToast.show(oObj.error.message.value);
                }
            })
        }
    });
});