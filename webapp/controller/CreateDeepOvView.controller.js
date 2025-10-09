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
        onNavBack: function () {
            const oHistory = sap.ui.core.routing.History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("RouteView1");
            }
        },
        
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

            const oI18n = oView.getModel("i18n").getResourceBundle();

            const oForm = this.byId("FormChange480_12124-2");

            const aInputs = oForm.findAggregatedObjects(true, function (oControl) {
                return oControl instanceof sap.m.Input;
            });

            let bValid = true;

            aInputs.forEach(function (oInput) {
                if (oInput.getValue() === "") {
                    oInput.setValueState("Error");

                    oInput.setValueStateText(oI18n.getText("requiredField"));

                    bValid = false;
                } else {
                    oInput.setValueState("None");
                }
            });

            if (!bValid) {
                MessageBox.alert(oI18n.getText("requiredFieldMessage"));

                return;
            };
            
            const oData = {};

            const oModel = oView.getModel("items");

            const oItems = oModel.getData();

            oData.ClienteId  = parseFloat(oView.byId("clienteIdCreateDeep").getValue());
            oData.CriadoPor  = oView.byId("criadoPorCreateDeep").getValue();
            oData.TotalItens = oView.byId("totalItensCreateDeep").getValue();
            oData.TotalFrete = oView.byId("totalFreteCreateDeep").getValue();
            oData.TotalOrdem = oView.byId("totalOrdemCreateDeep").getValue();
            oData.Status     = oView.byId("statusOrdemCreateDeep").getValue();

            const oInput = oView.byId("statusOrdemCreateDeep");

            if (oData.Status.length > 1) {
                oInput.setValueState("Error");

                oInput.setValueStateText(oI18n.getText("invalidValue"));

                MessageBox.alert(oI18n.getText("statusFieldError"));

                return;
            }

            oInput.setValueState("None");

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

            const oInput = oView.byId("quantidade");

            const iQuantity = oView.byId("quantidade").getValue();

            let bIsInteger = true;

            if (iQuantity != "") {
                bIsInteger = /^\d+$/.test(iQuantity.trim());
            };

            if (!bIsInteger) {
                const oI18n = oView.getModel("i18n").getResourceBundle();

                oInput.setValueState("Error");

                oInput.setValueStateText(oI18n.getText("invalidValue"));

                MessageBox.alert(oI18n.getText("onlyIntegerValues"));

                return;
            };

            oInput.setValueState("None");

            let iUnitPrice = oView.byId("precoUni").getValue();

            iUnitPrice = iUnitPrice.replace(",", ".");

            const iTotalPrice = Number(iQuantity) * Number(iUnitPrice);

            oView.byId("precoTot").setValue(iTotalPrice);
        },

        onAddItem: function () {
            const oView = this.getView();

            const oI18n = oView.getModel("i18n").getResourceBundle();

            const oForm = oView.byId("FormChange480_12124-3");

            const aInputs = oForm.findAggregatedObjects(true, function (oControl) {
                return oControl instanceof sap.m.Input;
            });

            let bValido = true;

            aInputs.forEach(function(oInput){
                if (oInput.getValue() === "") {
                    oInput.setValueState("Error");

                    oInput.setValueStateText(oI18n.getText("requiredField"));
                    
                    bValido = false;
                } else {
                    oInput.setValueState("None");
                }
            });

            if (!bValido) {
                MessageBox.alert(oI18n.getText("fillItem"));

                return;
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

            MessageToast.show(oI18n.getText("addItems"));

            this.onCleanItem();
        },

        create: function(oData) {
            const that = this;
            const oView = this.getView();
            const oModel = this.getOwnerComponent().getModel();
            const oI18n = oView.getModel("i18n").getResourceBundle();

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

                        MessageToast.show(oI18n.getText("createdSalesOrder"));

                    } else {
                        MessageToast.show(oI18n.getText("errorCreateOrder"));
                    };
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