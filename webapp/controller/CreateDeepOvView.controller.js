sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, MessageToast, MessageBox) => {
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

            let iTotalItems = oView.byId("totalItensCreateDeep").getValue();
            let iTotalFreight = oView.byId("totalFreteCreateDeep").getValue();

            iTotalItems = iTotalItems.replace(",", ".");
            iTotalFreight = iTotalFreight.replace(",", ".");

            let iTotalOrdem = Number(iTotalItems) + Number(iTotalFreight);

            oView.byId("totalOrdemCreateDeep").setValue(iTotalOrdem);
        },

        onCreate: function () {
            const oView = this.getView();

            const oForm = this.byId("FormChange480_12124-2");

            const aInputs = oForm.findAggregatedObjects(true, function (oControl) {
                return oControl instanceof sap.m.Input;
            });

            let bValido = true;

            aInputs.forEach(function (oInput) {
                if (oInput.getValue() === "") {
                    oInput.setValueState("Error");

                    oInput.setValueStateText("Campo Obrigatório");

                    bValido = false;
                } else {
                    oInput.setValueState("None");
                }
            });

            if (!bValido) {
                MessageBox.alert("Preencha todos os campos obrigatórios!");

                return;
            }
            
            const oData = {};

            const oModel = oView.getModel("items");

            const oItems = oModel.getData();

            oData.ClienteId  = parseFloat(oView.byId("clienteIdCreateDeep").getValue());
            oData.CriadoPor  = oView.byId("criadoPorCreateDeep").getValue();
            oData.TotalItens = oView.byId("totalItensCreateDeep").getValue();
            oData.TotalFrete = oView.byId("totalFreteCreateDeep").getValue();
            oData.TotalOrdem = oView.byId("totalOrdemCreateDeep").getValue();
            oData.Status     = oView.byId("statusOrdemCreateDeep").getValue();

            if (oData.Status.length > 1) {
                MessageBox.alert("Campo Status com muitos caracteres (Máximo: 1)!");

                return;
            }

            if(oItems.QuantityItems > 0) {
                oData.toOVItem = oItems.Items;
            };

            this.create(oData);
            
        },

        onClean: function () {
            const oView = this.getView();

            oView.byId("clienteIdCreateDeep").setValue("");
            oView.byId("totalItensCreateDeep").setValue("");
            oView.byId("totalFreteCreateDeep").setValue("");
            oView.byId("statusOrdemCreateDeep").setValue("");
            oView.byId("totalOrdemCreateDeep").setValue("");;
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

            let iQuantity = oView.byId("quantidade").getValue();
            let iUnitPrice = oView.byId("precoUni").getValue();

            iQuantity = iQuantity.replace(",", ".");
            iUnitPrice = iUnitPrice.replace(",", ".");

            const iTotalPrice = Number(iQuantity) * Number(iUnitPrice);

            oView.byId("precoTot").setValue(iTotalPrice);
        },

        onAddItem: function () {
            const oView = this.getView();

            const oForm = oView.byId("FormChange480_12124-3");

            const aInputs = oForm.findAggregatedObjects(true, function (oControl) {
                return oControl instanceof sap.m.Input;
            });

            let bValido = true;

            aInputs.forEach(function(oInput){
                if (oInput.getValue() === "") {
                    oInput.setValueState("Error");

                    oInput.setValueStateText("Campo Obrigatório");
                    
                    bValido = false;
                } else {
                    oInput.setValueState("None");
                }
            });

            if (!bValido) {
                MessageBox.alert("Preencha Todos os Campos do Item!");

                return
            };

            const oItem = {};

            const oModel = oView.getModel("items");

            const oData = oModel.getData();

            oItem.ItemId = parseFloat(oView.byId("itemId").getValue());
            oItem.Material = oView.byId("material").getValue();
            oItem.Descricao = oView.byId("descricao").getValue();
            oItem.Quantidade = parseFloat(oView.byId("quantidade").getValue());
            oItem.PrecoUni = oView.byId("precoUni").getValue();
            oItem.PrecoTot = oView.byId("precoTot").getValue();

            oData.Items.push(oItem);

            oData.QuantityItems++;

            oModel.setData(oData);

            MessageToast.show("Item Criado com Sucesso");

            this.onCleanItem();

        },

        create: function(oData) {
            const that = this;
            const oView = this.getView();
            const oModel = this.getOwnerComponent().getModel();

            oView.setBusy(true);

            oModel.create("/OVCabSet", oData, {
                success: function (oData2, oResponse) {
                    oView.setBusy(false);

                    if(oResponse.statusCode == 201) {
                        const oItemModel = oView.getModel("items");

                        const oItem = oItemModel.getData();

                        oItem.Items = [];
                        oItem.QuantityItems = 0;

                        oItemModel.setData(oItem);

                        oView.byId("ordemIdCreateDeep").setValue(oData2.OrdemId);
                        oView.byId("totalOrdemCreateDeep").setValue(oData2.TotalOrdem);

                        that.onClean();

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