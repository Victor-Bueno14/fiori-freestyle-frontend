sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("zov.controller.View2", {
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
                "OrdenacaoTipo": "ASC",
                "Limite": 10,
                "Offset": 0
            });

            oView.setModel(oFModel, "filter");

            const oTModel = new sap.ui.model.json.JSONModel();
            oTModel.setData([]);
            oView.setModel(oTModel, "table");

            this.onFilterSearch();
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

        onHome: function () {

            this.getRouter().navTo("RouteView1")

        },

        onCreateOv: function() {

            this.getRouter().navTo("RouteCreateOv");

        },

        onCreateDeepOv: function() {

            this.getRouter().navTo("RouteCreateDeepOv");

        },

        onReadOv: function() {

            this.getRouter().navTo("RouteReadOv");

        },

        onEditOv: function () {

            this.getRouter().navTo("RouteEditOv");

        },

        onDeleteOv: function () {

            this.getRouter().navTo("RouteDeleteOv");

        },

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        onFilterReset: function () {

        },

        onFilterSearch: function () {
            let oFilter = null;

            const oView = this.getView();
            const oModel = this.getOwnerComponent().getModel();
            const oFModel = oView.getModel("filter");
            const oTModel = oView.getModel("table");
            const oFData = oFModel.getData();
            const aParams = [];

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

            let bDescending = false;

            if(oFData.OrdenacaoTipo == "DESC") {
                bDescending = true;
            };

            //Criando a Ordenação
            const oSort = new sap.ui.model.Sorter(oFData.OrdenacaoCampo, bDescending);
            aSorter.push(oSort);

            console.log(oSort, aSorter);

            //Limite e Offset
            aParams.push("$top=" + oFData.Limite);
            aParams.push("$skip=" + oFData.Offset);

            //Executando Filtro
            oView.setBusy(true);
            
            oModel.read("/OVCabSet",{
                sorters: aSorter,
                filters: aFilters,
                urlParameters: aParams,

                success: function (oData2) {
                    oView.setBusy(false);
                    oTModel.setData(oData2.results);
                },
                error: function (oError){
                    oView.setBusy(false);
                    oTModel.show("Erro");
                }
            })
        },
    });
});