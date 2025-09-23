sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("zov.controller.CreateDeepOvView", {
        //Métodos do framework[->]
        onInit: function() {

            const oView = this.getView();

            const oDate = new Date();

            const sDate = oDate.toLocaleDateString("pt-BR");

            const sUser = sap.ushell.Container.getService("UserInfo").getId();

            oView.byId("dataCriacaoCreateDeep").setValue(sDate);

            oView.byId("criadoPorCreateDeep").setValue(sUser);

            const oModelItens = new sap.ui.model.json.JSONModel();

            oModelItens.setData({
                "Items": [],
                "QuantityItems": 0
            });

            oView.setModel(oModelItens, "items");
        },
        //Métodos do framework[<-]
        onChange: function () {
            const oView = this.getView();

            let iTotalItems = Number(oView.byId("totalItensCreateDeep").getValue());
            let iTotalFreight = Number(oView.byId("totalFreteCreateDeep").getValue());

            let iTotalOrdem = iTotalItems + iTotalFreight;

            oView.byId("totalOrdemCreateDeep").setValue(iTotalOrdem);
        },

        onCreate: function () {
            const oData = {};

            const oView = this.getView();

            const oModel = oView.getModel("items");

            const oItems = oModel.getData();

            oData.CriadoPor = oView.byId("criadoPorCreateDeep").getValue();
            oData.ClienteId = parseFloat(oView.byId("clienteIdCreateDeep").getValue());
            oData.TotalItens = oView.byId("totalItensCreateDeep").getValue();
            oData.TotalFrete = oView.byId("totalFreteCreateDeep").getValue();
            oData.TotalOrdem = oView.byId("totalOrdemCreateDeep").getValue();
            oData.Status = oView.byId("statusOrdemCreateDeep").getValue();

            if (oData.ClienteId === "" || oData.TotalItens === "" || oData.TotalFrete === "" || oData.Status === "") {
                MessageToast.show("Preencha todos os campos!");
            } else {
                if(oItems.QuantityItems > 0) {
                    oData.toOVItem = oItems.Items;
                };

                this.create(oData);
            };
        },

        onClean: function () {
            const oView = this.getView();

            oView.byId("clienteIdCreateDeep").setValue("");
            oView.byId("totalItensCreateDeep").setValue("");
            oView.byId("totalFreteCreateDeep").setValue("");
            oView.byId("statusOrdemCreateDeep").setValue("");
            oView.byId("totalOrdemCreateDeep").setValue("");

            this.onCleanItem();
        },

        onCleanItem: function () {
            const oView = this.getView();

            oView.byId("itemId").setValue("");
            oView.byId("material").setValue("");
            oView.byId("descricao").setValue("");
            oView.byId("quantidade").setValue("");
            oView.byId("precoUni").setValue("");
            oView.byId("precoTot").setValue("");
        },

        onChangeItem: function () {
            const oView = this.getView();

            const iQuantity = Number(oView.byId("quantidade").getValue());
            const iUnitPrice = Number(oView.byId("precoUni").getValue());

            const iTotalPrice = iQuantity * iUnitPrice;

            oView.byId("precoTot").setValue(iTotalPrice);
        },

        onAddItem: function () {
            const oItem = {};

            const oView = this.getView();

            const oModel = oView.getModel("items");

            const oData = oModel.getData();

            oItem.ItemId = parseFloat(oView.byId("itemId").getValue());
            oItem.Material = oView.byId("material").getValue();
            oItem.Descricao = oView.byId("descricao").getValue();
            oItem.Quantidade = parseFloat(oView.byId("quantidade").getValue());
            oItem.PrecoUni = oView.byId("precoUni").getValue();

            console.log(oData);

             if (
                 oItem.ItemId === "" ||
                 oItem.Material === "" ||
                 oItem.Descricao === "" ||
                 oItem.Quantidade === "" ||
                 oItem.PrecoUni === ""
             ) {
                MessageToast.show("Preencha Todos os Campos do Item");
             } else {
                oData.Items.push(oItem);

                oData.QuantityItems++;

                oModel.setData(oData);

                MessageToast.show("Item Criado com Sucesso");

                this.onCleanItem();
             };
        },

        create: function(oData) {
            const oView = this.getView();
            const oModel = this.getOwnerComponent().getModel();

            oView.setBusy(true);

            oModel.create("/OVCabSet", oData, {
                success: function (oData2, oResponse) {
                    oView.setBusy(false);

                    if(oResponse.statusCode == 201) {
                        oView.byId("ordemIdCreateDeep").setValue(oData2.OrdemId);
                        oView.byId("totalOrdemCreateDeep").setValue(oData2.TotalOrdem);
                        MessageToast.show("Ordem Cadastrada com Sucesso");

                        this.onClean();
                    } else {
                        MessageToast.show("Erro no Cadastro");
                    }
                },
                error: function (oError) {
                    oView.setBusy(false);

                    const oObj = JSON.parse(oError.responseText);

                    MessageToast.Show(oObj.error.message.value);
                }
            })
        }
    });
});