"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ej2_grids_1 = require("@syncfusion/ej2-grids");
var ej2_buttons_1 = require("@syncfusion/ej2-buttons");
var ej2_base_1 = require("@syncfusion/ej2-base");
ej2_grids_1.Grid.Inject(ej2_grids_1.Edit, ej2_grids_1.Toolbar, ej2_grids_1.Page);
var flag = false;
var grid = new ej2_grids_1.Grid({
    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
    allowPaging: true,
    actionBegin: actionBegin,
    actionComplete: actionComplete,
    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
    columns: [
        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, isPrimaryKey: true, type: 'number' },
        { field: 'CustomerID', width: 140, headerText: 'Customer ID', type: 'string' },
        { field: 'ShipCity', headerText: 'ShipCity', width: 140 },
        { field: 'ShipCountry', headerText: 'ShipCountry', width: 140 }
    ]
});
grid.appendTo('#Grid');
var button = new ej2_buttons_1.Button({
    content: 'Bind data via Fetch',
    cssClass: 'e-success'
});
button.appendTo('#buttons');
document.getElementById('buttons').onclick = function () {
    var fetchRequest = new ej2_base_1.Fetch("https://localhost:7110/Grid/Getdata", 'POST'); //Use remote server host number instead ****
    fetchRequest.send();
    fetchRequest.onSuccess = function (data) {
        grid.dataSource = data;
    };
};
function actionComplete(e) {
    if (e.requestType === 'save' || e.requestType === 'delete') {
        flag = false;
    }
}
function actionBegin(e) {
    if (!flag) {
        if (e.requestType == 'save' && (e.action == 'add')) {
            var editedData = e.data;
            e.cancel = true;
            var fetchRequest = new ej2_base_1.Fetch({
                url: 'https://localhost:7110/Grid/Insert',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ value: editedData })
            });
            fetchRequest.onSuccess = function () {
                flag = true;
                grid.endEdit();
            };
            fetchRequest.onFailure = function () {
                flag = false;
            };
            fetchRequest.send();
        }
        if (e.requestType == 'save' && (e.action == "edit")) {
            var editedData = e.data;
            e.cancel = true;
            var fetchRequest = new ej2_base_1.Fetch({
                url: 'https://localhost:7110/Grid/Update',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ value: editedData })
            });
            fetchRequest.onSuccess = function () {
                flag = true;
                grid.endEdit();
            };
            fetchRequest.onFailure = function () {
                flag = false;
            };
            fetchRequest.send();
        }
        if (e.requestType == 'delete') {
            var editedData = e.data;
            e.cancel = true;
            var fetchRequest = new ej2_base_1.Fetch({
                url: 'https://localhost:7110/Grid/Delete',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ key: editedData[0][grid.getPrimaryKeyFieldNames()[0]] })
            });
            fetchRequest.onSuccess = function () {
                flag = true;
                grid.deleteRecord();
            };
            fetchRequest.onFailure = function () {
                flag = false;
            };
            fetchRequest.send();
        }
    }
}
//# sourceMappingURL=index.js.map