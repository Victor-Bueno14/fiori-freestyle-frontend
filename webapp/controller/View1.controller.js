sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {
        //Métodos do framework[->]
        onInit: function() {
            const oView = this.getView();
            const oFModel = new sap.ui.model.json.JSONModel();

            oFModel.setData({
                "OrdemId": "",
                "DataCriacao": "",
                "CriadoPor": "",
                "ClienteId": "",
                "TotalItens": "",
                "TotalFrete": "",
                "TotalOrder": "",
                "Status": "",
                "OrdenacaoCampo": "OrdemId",
                "OrdenacaoTipo": "ASC"
            });

            oView.setModel(oFModel, "filter");

            this.onFilterSearch();
        },
        //Métodos do framework[<-]
        onFilterReset: function () {
            const oView = this.getView();
            const oModel = oView.getModel("filter");
            const oData = oModel.getData();

            oData.OrdemId = "";
            oData.ClienteId = "";
            oData.OrdenacaoCampo = "OrdemId";
            oData.OrdenacaoTipo = "ASC";

            oModel.setData(oData);

            this.onFilterSearch();
        },

        onFilterSearch: function () {
            let oFilter = null;

            const oView = this.getView();
            const oTable = oView.byId("table");
            const oFModel = oView.getModel("filter");
            const oFData = oFModel.getData();

            //Aplicando filtros
            const aSorter = [];
            const aFilters = [];

            if (oFData.OrdemId != "") {
                //Criando Filtro do Ordem Id
                oFilter = new sap.ui.model.Filter({
                    path: 'OrdemId', //Caminho do Campo (model da tabela)
                    operator: sap.ui.model.FilterOperator.EQ, //Operador de Comparação
                    value1: oFData.OrdemId //Valor do Filtro 
                });

                aFilters.push(oFilter);
            };

            if (oFData.ClienteId != "" ) {
                //Criando Filtro do CLiente Id
                oFilter = new sap.ui.model.Filter({
                    path: 'ClienteId',
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: oFData.ClienteId
                });

                aFilters.push(oFilter);
            };

            let bDescending = false;

            if(oFData.OrdenacaoTipo == "DESC") {
                bDescending = true;
            };

            //Criando a Ordenação
            const oSort = new sap.ui.model.Sorter(oFData.OrdenacaoCampo, bDescending);
            aSorter.push(oSort);

            //Executando Filtro
            oTable.bindRows({
                path: "/OVCabSet",
                sorter: aSorter,
                filters: aFilters
            });
        },

        onUpdateStatus(sStatus) {
            const oTable = this.getView().byId("table");
            const oModel = this.getOwnerComponent().getModel();
            const aIndex = oTable.getSelectedIndices();
            const that = this;

            console.log(aIndex);

            if (aIndex.length == 0) {
                MessageBox.alert("Selecione uma linha!");

                return
            };

            this.getView().setBusy(true);

            aIndex.forEach(function(iIndex) {
                const oItem = oTable.getContextByIndex(iIndex);
                const iOrdemId = oItem.getProperty("OrdemId");

                oModel.callFunction(
                    "/ZFI_ATUALIZA_STATUS",
                    {
                        method: "GET",
                        urlParameters: {
                            ID_ORDEMID: iOrdemId,
                            ID_STATUS: sStatus
                        },
                        success: function(){
                            MessageToast.show("Status atualizado com sucesso!");

                            that.onFilterSearch();
                        },
                        error: function(){
                            MessageBox.alert("Erro ao atualizar status");
                        }
                    }
                )
            });

            this.getView().setBusy(false);
        }
    });
});