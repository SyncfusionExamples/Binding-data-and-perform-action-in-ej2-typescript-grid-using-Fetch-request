import { Grid, Edit, Toolbar, EditEventArgs, Page } from '@syncfusion/ej2-grids';
import { Button } from '@syncfusion/ej2-buttons';
import { Fetch } from '@syncfusion/ej2-base';


Grid.Inject(Edit, Toolbar, Page);


let flag: Boolean = false;


let grid: Grid = new Grid({
    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
    allowPaging: true,
    actionBegin : actionBegin,
    actionComplete:actionComplete,
    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
    columns: [
        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, isPrimaryKey: true, type: 'number' },
        { field: 'CustomerID', width: 140, headerText: 'Customer ID', type: 'string' },
        { field: 'ShipCity', headerText: 'ShipCity', width: 140 },
        { field: 'ShipCountry', headerText: 'ShipCountry', width: 140 }
    ]
});

grid.appendTo('#Grid');

let button: Button = new Button({
    content: 'Bind data via Fetch',
    cssClass:'e-success'
});
button.appendTo('#buttons');

(document.getElementById('buttons') as HTMLElement).onclick = function () {
    const fetchRequest = new Fetch("https://localhost:7110/Grid/Getdata", 'POST');//Use remote server host number instead ****
    fetchRequest.send();
    fetchRequest.onSuccess = (data) => {
        grid.dataSource = data;
    };
};

function actionComplete(e: EditEventArgs) {
    if (e.requestType === 'save' || e.requestType === 'delete') {
        flag = false;
    }
}
function actionBegin(e: EditEventArgs) {

    if (!flag) {
        if (e.requestType == 'save' && ((e as any).action == 'add')) {
            var editedData = (e as any).data;
            e.cancel = true;
            var fetchRequest = new Fetch({
                url: 'https://localhost:7110/Grid/Insert',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ value: editedData })
            });
            fetchRequest.onSuccess = () => {
                flag = true;
                grid.endEdit();
            };
            fetchRequest.onFailure = () => {
                flag = false;
            };
            fetchRequest.send();
        }
        if (e.requestType == 'save' && ((e as any).action == "edit")) {
            var editedData = (e as any).data;
            e.cancel = true;
            var fetchRequest = new Fetch({
                url: 'https://localhost:7110/Grid/Update',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ value: editedData })
            });
            fetchRequest.onSuccess = () => {
                flag = true;
                grid.endEdit();
            };
            fetchRequest.onFailure = () => {
                flag = false;
            };
            fetchRequest.send();
        }
        if (e.requestType == 'delete') {
            var editedData = (e as any).data;
            e.cancel = true;
            var fetchRequest = new Fetch({
                url: 'https://localhost:7110/Grid/Delete',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ key: editedData[0][grid.getPrimaryKeyFieldNames()[0]] })
            });
            fetchRequest.onSuccess = () => {
                flag = true;
                grid.deleteRecord();
            };
            fetchRequest.onFailure = () => {
                flag = false;
            };
            fetchRequest.send();
        }
    }
}