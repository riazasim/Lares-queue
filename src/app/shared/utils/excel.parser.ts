import readXlsxFile from 'read-excel-file';
import { Row } from 'read-excel-file/types';
import { from, Observable } from 'rxjs';
import * as ExcelJS from 'exceljs';
import {CountryModel, LocationModel} from 'src/app/core/models/location.model';
import { BookingModel } from 'src/app/core/models/booking.model';
import { parseDateToDbFormat } from './date.functions';
import { OperationModel } from 'src/app/core/models/operation.model';
import { DockModel } from 'src/app/core/models/dock.model';
import { ProductModel } from 'src/app/core/models/product.model';
import { PartnerModel } from 'src/app/core/models/partner.model';

export const parseExcelFile = (file: File): Observable<Row[]> => {
  return from(readXlsxFile(file));
}

export const convertExcelRowToBasicLocation = (row: Row): LocationModel => {
    return <LocationModel>{
        name: `${row[0]}`,
        addrCoordinates: row[1],
        addrStreet: row[2],
        addrNumber: row[3],
        addrCity: row[4],
        addrCountry: row[5],
        addrCounty: row[6],
        addrZipCode: row[7],
        addrTimezone: `${row[8]}`,
        contactFirstName: `${row[9]}`,
        contactLastName: row[10],
        contactPhone: row[11],
        contactPhoneRegionCode: row[12],
        contactEmail: row[13],
        comments: row[14]
    }
}

export const convertExcelRowToBasicPlanning = (row: Row): BookingModel => {
  return <BookingModel>{
    operation: +`${row[0]}`.split(' ')[0],
    truckLicensePlateFront: row[1],
    truckLicensePlateBack: row[2],
    firstName: row[3],
    lastName: row[4],
    identityDocumentNumber: row[5],
    email: row[6],
    phoneRegionCode: row[7],
    phoneNumber: `${row[8]}`,
    schedulingDate: parseDateToDbFormat(`${row[9]}`),
    timeSlot: row[10],
    clientInstruction: row[11],
    dock: +`${row[12]}`.split(' ')[0],
    statusListStatus: 'Created' as any
  }
}

export const convertExcelRowToUmexPlanning = (row: Row): BookingModel => {
  return <BookingModel>{
    operation: +`${row[0]}`.split(' ')[0],
    truckLicensePlateFront: row[1],
    truckLicensePlateBack: row[2],
    firstName: row[3],
    lastName: row[4],
    identityDocumentNumber: row[5],
    email: row[6],
    phoneRegionCode: row[7],
    phoneNumber: `${row[8]}`,
    schedulingDate: parseDateToDbFormat(`${row[9]}`),
    timeSlot: row[10],
    clientInstruction: row[11],
    dock: +`${row[12]}`.split(' ')[0],
    statusListStatus: 'Created' as any,
    trailerType: +`${row[13]}`.split(' ')[0],
    goodsBuyer: `${row[14]}`.split(' ').slice(2).join(' '),
    goodsSupplier: `${row[15]}`.split(' ').slice(2).join(' '),
    goods: +`${row[16]}`.split(' ')[0],
    goodsDescription: row[17],
    packageType: +`${row[18]}`.split(' ')[0],
    quantity: row[19],
    loadUnloadingPlace: row[20]
  }
}

export const convertExcelRowToChimpexPlanning = (row: Row): BookingModel => {
  return <BookingModel>{
    operation: +`${row[0]}`.split(' ')[0],
    truckLicensePlateFront: row[1],
    truckLicensePlateBack: row[2],
    firstName: row[3],
    lastName: row[4],
    identityDocumentNumber: row[5],
    email: row[6],
    phoneRegionCode: row[7],
    phoneNumber: `${row[8]}`,
    schedulingDate: parseDateToDbFormat(`${row[9]}`),
    timeSlot: row[10],
    clientInstruction: row[11],
    dock: +`${row[12]}`.split(' ')[0],
    statusListStatus: 'Created' as any,
    goods: +`${row[13]}`.split(' ')[0],
    goodsNoticeNr: row[14],
  }
}

export const convertExcelRowToComvexPlanning = (row: Row): BookingModel => {
  return <BookingModel>{
    operation: +`${row[0]}`.split(' ')[0],
    truckLicensePlateFront: row[1],
    truckLicensePlateBack: row[2],
    firstName: row[3],
    lastName: row[4],
    identityDocumentNumber: row[5],
    email: row[6],
    phoneRegionCode: row[7],
    phoneNumber: `${row[8]}`,
    schedulingDate: parseDateToDbFormat(`${row[9]}`),
    timeSlot: row[10],
    clientInstruction: row[11],
    dock: +`${row[12]}`.split(' ')[0],
    statusListStatus: 'Created' as any,
    goodsBuyer: `${row[13]}`.split(' ').slice(2).join(' '),
    goodsSupplier: `${row[14]}`.split(' ').slice(2).join(' '),
    goods: +`${row[15]}`.split(' ')[0],
    country: row[16],
    loadUnloadingPlace: row[17],
    goodsDate: parseDateToDbFormat(`${row[18]}`),
    harvestYear: row[19],
    quantityBrut: row[20],
    quantityEmptyContainer: row[21],
    quantityNet: row[22],
  }
}

export const generateBasicExcel = async (lang: string): Promise<Blob> => {
  const workbook = new ExcelJS.Workbook();
  const list = workbook.addWorksheet('basic');
  list.getColumn(1).width = 15;
  list.getColumn(2).width = 25;
  list.getColumn(3).width = 25;
  list.getColumn(4).width = 15;
  list.getColumn(5).width = 15;
  list.getColumn(6).width = 30;
  list.getColumn(7).width = 15;
  list.getColumn(8).width = 25;
  list.getColumn(8).numFmt = '@';
  list.getColumn(9).width = 15;
  list.getColumn(10).width = 16;
  list.getColumn(10).numFmt = '@';
  list.getColumn(11).width = 10;
  list.getColumn(11).numFmt = '@';
  list.getColumn(12).width = 20;
  list.getColumn(12).numFmt = '@';
  list.getColumn(13).width = 20;
  list.getColumn(14).width = 20;


  const data = [
    lang === 'en' ?
    {
      'Name': '',
      'Address Coordinates': '',
      'Address Street': '',
      'Address Number': '',
      'Address City': '',
      'Address Country': '',
      'Address County': '',
      'Address Zip Code': '',
      'Address Timezone': '',
      'Contact First Name': '',
      'Contact Last Name': '',
      'Contact Phone': '',
      'contact Phone Region Code': '',
      'Contact Email': '',
      'Comments': ''
    } : {
        'Name': '',
        'Address Coordinates': '',
        'Address Street': '',
        'Address Number': '',
        'Address City': '',
        'Address Country': '',
        'Address County': '',
        'Address Zip Code': '',
        'Address Timezone': '',
        'Contact First Name': '',
        'Contact Last Name': '',
        'Contact Phone': '',
        'contact Phone Region Code': '',
        'Contact Email': '',
        'Comments': ''
    }
  ]

  // Add headers
  const headers = Object.keys(data[0]);
  list.addRow(headers);

  // Add data
  data.forEach((item: any) => {
    const row:any = [];
    headers.forEach((header) => {
      row.push(item[header]);
    });
    list.addRow(row);
  });

  list.getCell('L2').alignment = { wrapText: true };
  list.getCell('J2').dataValidation = {
    type: 'textLength',
    operator: 'equal',
    formulae: ['10']
  }
  list.getCell('K2').dataValidation = {
    type: 'textLength',
    operator: 'equal',
    formulae: ['8']
  }

  return workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: '.xlsx' });
    return blob;
  })
}

export const generateUmexExcel = async (lang: string, operations: OperationModel[], docks: DockModel[],
  partners: PartnerModel[], products: ProductModel[]): Promise<Blob> => {
const workbook = new ExcelJS.Workbook();
const list = workbook.addWorksheet('umex');
const customers = partners.filter(p => p.type.toLowerCase() === 'customer');
const suppliers = partners.filter(p => p.type.toLowerCase() === 'vendor');
list.getColumn(1).width = 15;
list.getColumn(2).width = 25;
list.getColumn(3).width = 25;
list.getColumn(4).width = 15;
list.getColumn(5).width = 15;
list.getColumn(6).width = 30;
list.getColumn(7).width = 15;
list.getColumn(8).width = 25;
list.getColumn(8).numFmt = '@';
list.getColumn(9).width = 15;
list.getColumn(10).width = 16;
list.getColumn(10).numFmt = '@';
list.getColumn(11).width = 10;
list.getColumn(11).numFmt = '@';
list.getColumn(12).width = 20;
list.getColumn(12).numFmt = '@';
list.getColumn(13).width = 20;
list.getColumn(14).width = 18;
list.getColumn(15).width = 18;
list.getColumn(16).width = 18;
list.getColumn(17).width = 15;
list.getColumn(18).width = 20;
list.getColumn(19).width = 20;
list.getColumn(19).numFmt = '@';
list.getColumn(20).width = 20;
list.getColumn(21).width = 15;

// Operations Sheet
const operationSheet = workbook.addWorksheet('operations');
operations.forEach((item) => {
operationSheet.addRow([`${item.id} - ${item.name}`]);
})
operationSheet.state = 'veryHidden';

// Dock Sheet
const dockSheet = workbook.addWorksheet('docks');
docks.forEach((item) => {
dockSheet.addRow([`${item.id} - ${item.name}`]);
})
dockSheet.state = 'veryHidden';

// Trailer Types
const trailerTypeSheet = workbook.addWorksheet('trailerTypes');
['1 - Bena', '2 - Prelata', '3 - Cisterna', '4 - Platforma', '5 - Silotruck', '6 - Agabaritic'].forEach((type) => {
trailerTypeSheet.addRow([type]);
})
trailerTypeSheet.state = 'veryHidden';

// Customers Sheet
const customerSheet = workbook.addWorksheet('customers');
customers.forEach((item) => {
customerSheet.addRow([`${item.id} - ${item.name}`]);
})
customerSheet.state = 'veryHidden';

// Supplier Sheet
const supplierSheet = workbook.addWorksheet('suppliers');
suppliers.forEach((item) => {
supplierSheet.addRow([`${item.id} - ${item.name}`]);
})
supplierSheet.state = 'veryHidden';

// Product Sheet
const productSheet = workbook.addWorksheet('products');
products.forEach((p) => {
productSheet.addRow([`${p.id} - ${p.name}`]);
})
productSheet.state = 'veryHidden';

// Package Type Sheet
const packageSheet = workbook.addWorksheet('packageTypes');
['1 - Vrac', '2 - Colete'].forEach((item) => {
packageSheet.addRow([item]);
})
packageSheet.state = 'veryHidden';

const data = [
lang === 'en' ? 
{ 
'Operation': '',
'Truck License Plate Front': '',
'Truck License Plate Back': '',
'First name': '',
'Last name': '',
'Identity Document Number': '',
'Email': '',
'Phone Region Code': '',
'Phone number': '',
'Scheduling Date': '',
'Timeslot': '',
'Comments': '',
'Dock': '',
'Trailer Type': '',
'Goods Buyer': '',
'Goods Supplier': '',
'Product': '',
'Product Description': '',
'Package Type': '',
'Quantity (tons)': '',
'Load-Unloading Place': ''
} : {
'Operație': '',
'Nr. inm. cap tractor': '',
'Nr. inm. remorcă': '',
'Prenume': '',
'Nume': '',
'Serie și număr act de identitate': '',
'Email': '',
'Cod tara al nr. de telefon': '',
'Număr de telefon': '',
'Data': '',
'Ora': '',
'Comentarii': '',
'Doc': '',
'Tip remorca': '',
'Cumpărător marfă': '',
'Furnizor marfă': '',
'Marfa': '',
'Descriere marfă': '',
'Tip Ambalaj': '',
'Cantitatea (tone)': '',
'Loc de descarcare': ''
}
]

// Add headers
const headers = Object.keys(data[0]);
list.addRow(headers);

// Add data
data.forEach((item: any) => {
const row:any = [];
headers.forEach((header) => {
row.push(item[header]);
});
list.addRow(row);
});


list.getCell('A2').dataValidation = {
type: 'list',
allowBlank: true,
formulae: [`=operations!$A$1:$A$${operations.length}`]
};
list.getCell('L2').alignment = { wrapText: true };
list.getCell('J2').dataValidation = {
type: 'textLength',
operator: 'equal',
formulae: ['10']
}
list.getCell('K2').dataValidation = {
type: 'textLength',
operator: 'equal',
formulae: ['8']
}
list.getCell('M2').dataValidation = {
type: 'list',
allowBlank: true,
formulae: [`=docks!$A$1:$A$${docks.length}`]
};
list.getCell('N2').dataValidation = {
type: 'list',
allowBlank: true,
formulae: ['=trailerTypes!$A$1:$A$6']
};
list.getCell('O2').dataValidation = {
type: 'list',
allowBlank: true,
formulae: [`=customers!$A$1:$A$${customers.length}`]
};
list.getCell('P2').dataValidation = {
type: 'list',
allowBlank: true,
formulae: [`=customers!$A$1:$A$${suppliers.length}`]
};
list.getCell('Q2').dataValidation = {
type: 'list',
allowBlank: true,
formulae: [`=products!$A$1:$A$${products.length}`]
};
list.getCell('R2').alignment = { wrapText: true };
list.getCell('S2').dataValidation = {
type: 'list',
allowBlank: true,
formulae: [`=packageTypes!$A$1:$A$2`]
};

return workbook.xlsx.writeBuffer().then((buffer) => {
const blob = new Blob([buffer], { type: '.xlsx' });
return blob;
})
}

export const generateComvexExcel = async (lang: string, operations: OperationModel[], docks: DockModel[],
    partners: PartnerModel[], products: ProductModel[], countries: CountryModel[]): Promise<Blob> => {
const workbook = new ExcelJS.Workbook();
workbook.calcProperties.fullCalcOnLoad = true;
const list = workbook.addWorksheet('comvex');
const customers = partners.filter(p => p.type.toLowerCase() === 'customer');
const suppliers = partners.filter(p => p.type.toLowerCase() === 'vendor');
list.getColumn(1).width = 15;
list.getColumn(2).width = 25;
list.getColumn(3).width = 25;
list.getColumn(4).width = 15;
list.getColumn(5).width = 15;
list.getColumn(6).width = 30;
list.getColumn(7).width = 15;
list.getColumn(8).width = 25;
list.getColumn(8).numFmt = '@';
list.getColumn(9).width = 15;
list.getColumn(10).width = 16;
list.getColumn(10).numFmt = '@';
list.getColumn(11).width = 10;
list.getColumn(11).numFmt = '@';
list.getColumn(12).width = 20;
list.getColumn(12).numFmt = '@';
list.getColumn(13).width = 20;
list.getColumn(14).width = 15;
list.getColumn(15).width = 15;
list.getColumn(16).width = 15;
list.getColumn(17).width = 15;
list.getColumn(18).width = 20;
list.getColumn(19).width = 15;
list.getColumn(19).numFmt = '@';
list.getColumn(20).width = 15;
list.getColumn(20).numFmt = '@';
list.getColumn(21).width = 15;
list.getColumn(22).width = 20;
list.getColumn(23).width = 15;

const operationSheet = workbook.addWorksheet('operations');
operations.forEach((item) => {
operationSheet.addRow([`${item.id} - ${item.name}`]);
})
operationSheet.state = 'veryHidden';
const dockSheet = workbook.addWorksheet('docks');
docks.forEach((item) => {
dockSheet.addRow([`${item.id} - ${item.name}`]);
})
dockSheet.state = 'veryHidden';

// Customers Sheet
const customerSheet = workbook.addWorksheet('customers');
customers.forEach((item) => {
customerSheet.addRow([`${item.id} - ${item.name}`]);
})
customerSheet.state = 'veryHidden';

// Supplier Sheet
const supplierSheet = workbook.addWorksheet('suppliers');
suppliers.forEach((item) => {
supplierSheet.addRow([`${item.id} - ${item.name}`]);
})
supplierSheet.state = 'veryHidden';

// Product Sheet
const productSheet = workbook.addWorksheet('products');
products.forEach((p) => {
productSheet.addRow([`${p.id} - ${p.name}`]);
})
productSheet.state = 'veryHidden';

// Product Sheet
const countrySheet = workbook.addWorksheet('countries');
countries.forEach((item) => {
countrySheet.addRow([item.name]);
})
countrySheet.state = 'veryHidden';

const data = [
lang === 'en' ?
{
'Operation': '',
'Truck License Plate Front': '',
'Truck License Plate Back': '',
'First name': '',
'Last name': '',
'Identity Document Number': '',
'Email': '',
'Phone Region Code': '',
'Phone number': '',
'Scheduling Date': '',
'Timeslot': '',
'Comments': '',
'Dock': '',
'Goods Buyer': '',
'Goods Supplier': '',
'Product': '',
'Country': '',
'Load-Unloading Place': '',
'Notice date': '',
'Harvest Year': '',
'Quantity Brut': '',
'Quantity Empty Container': '',
'Qunatity Net': '' 
} : {
'Operație': '',
'Nr. inm. cap tractor': '',
'Nr. inm. remorcă': '',
'Prenume': '',
'Nume': '',
'Serie și număr act de identitate': '',
'Email': '',
'Cod tara al nr. de telefon': '',
'Număr de telefon': '',
'Data': '',
'Ora': '',
'Comentarii': '',
'Doc': '',
'Cumpărător marfă': '',
'Furnizor marfă': '',
'Marfa': '',
'Tara de origine': '',
'Loc de descarcare': '',
'Data aviz': '',
'Anul recoltei': '',
'Brut (kg)': '',
'Tara (kg)': '',
'Net (kg)': '',
}
]

// Add headers
const headers = Object.keys(data[0]);
list.addRow(headers);

// Add data
data.forEach((item: any) => {
const row:any = [];
headers.forEach((header) => {
row.push(item[header]);
});
list.addRow(row);
});


list.getCell('A2').dataValidation = {
type: 'list',
allowBlank: true,
formulae: [`=operations!$A$1:$A$${operations.length}`]
};
list.getCell('L2').alignment = { wrapText: true };
list.getCell('J2').dataValidation = {
type: 'textLength',
operator: 'equal',
formulae: ['10']
}
list.getCell('K2').dataValidation = {
type: 'textLength',
operator: 'equal',
formulae: ['8']
}
list.getCell('M2').dataValidation = {
type: 'list',
allowBlank: true,
formulae: [`=docks!$A$1:$A$${docks.length}`]
};

list.getCell('N2').dataValidation = {
type: 'list',
allowBlank: true,
formulae: [`=customers!$A$1:$A$${customers.length}`]
};
list.getCell('O2').dataValidation = {
type: 'list',
allowBlank: true,
formulae: [`=suppliers!$A$1:$A$${suppliers.length}`]
};
list.getCell('P2').dataValidation = {
type: 'list',
allowBlank: true,
formulae: [`=products!$A$1:$A$${products.length}`]
};
list.getCell('Q2').dataValidation = {
type: 'list',
allowBlank: true,
formulae: [`=countries!$A$1:$A$${countries.length}`]
};
list.getCell('W2').value = <ExcelJS.CellValue>{ formula: 'U2-V2' };
list.getCell('W2').dataValidation = {
type: 'decimal',
showErrorMessage: true,
operator: 'greaterThanOrEqual',
showInputMessage: true,
formulae: [0],
errorStyle: 'error',
errorTitle: 'Five',
error: 'The value must not be greater than 0 or equal to 0'
}

return workbook.xlsx.writeBuffer().then((buffer) => {
const blob = new Blob([buffer], { type: '.xlsx' });
return blob;
})
}

export const generateChimpexExcel = async (lang: string, operations: OperationModel[], docks: DockModel[], products: ProductModel[]): Promise<Blob> => {
const workbook = new ExcelJS.Workbook();
const list = workbook.addWorksheet('basic');
list.getColumn(1).width = 15;
list.getColumn(2).width = 25;
list.getColumn(3).width = 25;
list.getColumn(4).width = 15;
list.getColumn(5).width = 15;
list.getColumn(6).width = 30;
list.getColumn(7).width = 15;
list.getColumn(8).width = 25;
list.getColumn(8).numFmt = '@';
list.getColumn(9).width = 15;
list.getColumn(10).width = 16;
list.getColumn(10).numFmt = '@';
list.getColumn(11).width = 10;
list.getColumn(11).numFmt = '@';
list.getColumn(12).width = 20;
list.getColumn(12).numFmt = '@';
list.getColumn(13).width = 20;
list.getColumn(14).width = 20;
list.getColumn(15).width = 20;

const operationSheet = workbook.addWorksheet('operations');
operations.forEach((item) => {
operationSheet.addRow([`${item.id} - ${item.name}`]);
})
operationSheet.state = 'veryHidden';
const dockSheet = workbook.addWorksheet('docks');
docks.forEach((item) => {
dockSheet.addRow([`${item.id} - ${item.name}`]);
})
dockSheet.state = 'veryHidden';

// Product Sheet
const productSheet = workbook.addWorksheet('products');
products.forEach((p) => {
productSheet.addRow([`${p.id} - ${p.name}`]);
})
productSheet.state = 'veryHidden';

const data = [
lang === 'en' ? 
{ 
'Operation': '',
'Truck License Plate Front': '',
'Truck License Plate Back': '',
'First name': '',
'Last name': '',
'Identity Document Number': '',
'Email': '',
'Phone Region Code': '',
'Phone number': '',
'Scheduling Date': '',
'Timeslot': '',
'Comments': '',
'Dock': '',
'Product': '',
'Notice nr.': '',
} : {
'Operație': '',
'Nr. inm. cap tractor': '',
'Nr. inm. remorcă': '',
'Prenume': '',
'Nume': '',
'Serie și număr act de identitate': '',
'Email': '',
'Cod tara al nr. de telefon': '',
'Număr de telefon': '',
'Data': '',
'Ora': '',
'Comentarii': '',
'Doc': '',
'Produs': '',
'Nr. aviz': '',
}
]

// Add headers
const headers = Object.keys(data[0]);
list.addRow(headers);

// Add data
data.forEach((item: any) => {
const row:any = [];
headers.forEach((header) => {
row.push(item[header]);
});
list.addRow(row);
});


list.getCell('A2').dataValidation = {
type: 'list',
allowBlank: true,
formulae: [`=operations!$A$1:$A$${operations.length}`]
};
list.getCell('L2').alignment = { wrapText: true };
list.getCell('J2').dataValidation = {
type: 'textLength',
operator: 'equal',
formulae: ['10']
}
list.getCell('K2').dataValidation = {
type: 'textLength',
operator: 'equal',
formulae: ['8']
}
list.getCell('M2').dataValidation = {
type: 'list',
allowBlank: true,
formulae: [`=docks!$A$1:$A$${docks.length}`]
};

list.getCell('N2').dataValidation = {
type: 'list',
allowBlank: false,
formulae: [`=products!$A$1:$A$${products.length}`]
};

return workbook.xlsx.writeBuffer().then((buffer) => {
const blob = new Blob([buffer], { type: '.xlsx' });
return blob;
})
}