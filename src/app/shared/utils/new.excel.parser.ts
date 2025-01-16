import * as XLSX from 'xlsx';

export function parseExcelToJson(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
        const reader: FileReader = new FileReader();

        reader.onload = (e: any) => {
            try {
                const bstr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

                const wsname: string = wb.SheetNames[0]; // Assuming the first sheet
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                // Read the sheet as JSON (array of arrays)
                const excelData: any = XLSX.utils.sheet_to_json(ws, { header: 1 });

                // Convert Excel data to the required dynamic JSON structure
                const jsonData = transformToDynamicJSON(excelData);
                resolve(jsonData);  // Resolve the promise with the JSON data
            } catch (error) {
                reject(error);  // Reject the promise on error
            }
        };

        reader.onerror = (error) => {
            reject(error);  // Reject the promise if there's an error reading the file
        };

        reader.readAsBinaryString(file);  // Start reading the file
    });
}

function transformToDynamicJSON(excelData: any[][]) {
    // Define the initial structure
    const result: any = {
        data: {
            type: 'list',
            items: []
        }
    };

    // Loop through the Excel data rows (assuming data starts from row 2)
    excelData.slice(1).forEach((row) => {
        let shipment = []
        for (let i = 0; i < row[8].split(",").length; i++) {
            shipment.push(
                {
                    company: row[8].split(",")[i],
                    navigationType: row[9].split(",")[i],
                    ship: row[10].split(",")[i],
                    shipType: row[11].split(",")[i],
                    pavilion: row[12].split(",")[i],
                    enginePower: row[13].split(",")[i],
                    lengthOverall: row[14].split(",")[i],
                    width: row[15].split(",")[i],
                    maxDraft: row[16].split(",")[i],
                    maxQuantity: row[17].split(",")[i],
                    shipowner: row[18].split(",")[i],
                    purpose: row[19].split(",")[i],
                    operator: row[20].split(",")[i],
                    trafficType: row[21].split(",")[i],
                    operatonType: row[22].split(",")[i],
                    planningWaterShipmentProducts: row[23].split(",")[i],
                    quantity: row[24].split(",")[i],
                    unitNo: row[25].split(",")[i],
                    observation: row[26].split(",")[i],
                    additionalOperator: row[27].split(",")[i],
                    clientComments: row[28].split(",")[i],
                    operatorComments: row[29].split(",")[i],
                    estimatedTimeArrival: row[30].split(",")[i],
                    departurePort: row[31].split(",")[i],
                    arrivalPort: row[32].split(",")[i],
                    operation: row[33].split(",")[i],
                    operationName: row[34].split(",")[i]
                }
            )
        };

        const existingItem = result.data.items.find((item: any) => item.attributes.convoyType === row[0]);

        if (existingItem) {
            // If convoyType exists, append to the existing planningWaterShipments
            existingItem.attributes.planningWaterShipments.push(shipment);
        } else {
            // Otherwise, create a new item with a planningWaterShipments array
            const newItem = {
                type: 'planningWater',
                attributes: {
                    convoyType: row[0],
                    estimatedTimeArrival: String(row[1]),
                    locationPort: row[2],
                    company: row[3],
                    ridCoordinates: row[4],
                    departurePort: row[5],
                    arrivalPort: row[6],
                    pilotCompany: row[7],
                    planningWaterShipments: [...shipment]
                }
            };

            result.data.items.push(newItem);
        }
    });

    return result;
}
