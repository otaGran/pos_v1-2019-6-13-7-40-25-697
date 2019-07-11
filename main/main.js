'use strict';



const isBarcodeValid=(barcode)=>{
    let database = loadAllItems();
    for(let i = 0;i<database.length;i++){
        if(barcode === database[i].barcode)
            return true;
    }
    return false;
}

const isAllBarcodeValid=(barcodes)=>{
    for(let i = 0;i<barcodes.length;i++){
        if(isBarcodeValid(barcodes[i].substr(0,10)) === false)
            return false;
    }
    return true;
}


const splitTag=(tag)=>{

    let barcode = '';
    let count = 1;
    if(tag.indexOf("-") === -1){
        barcode = tag;
    }else{
        let tmpStr = tag.split("-");
        barcode = tmpStr[0];
        count = Number(tmpStr[1]);
    }


    return {"barcode":barcode,"count":count};
}

const dereplicate=(splitedTags)=>{
    let myMap = new Map();
    for(let i = 0;i< splitedTags.length;i++){
        if(myMap.has(splitedTags[i].barcode)){
            myMap[splitedTags[i].barcode] += splitedTags[i].count;
        }else{
            myMap[splitedTags[i].barcode] = splitedTags[i].count;
        }
    }
    let dereplicatedTags = [];

    for (var [key, value] of myMap.entries()) {
        dereplicatedTags.push({"barcode":key,"count":value});
    }
    return dereplicatedTags;


}

const normalizeTag=(tags)=>{

    let splitedTags = [];

    for(let i = 0;i<tags;i++){
        splitedTags.push(splitTag(tags[i]));
    }

    return dereplicate(splitedTags);
}

const getItemInfo=(barcode)=>{
    const database = loadAllItems();

    for(let i = 0;i<database.length;i++){
        if(barcode === database[i].barcode)
            return database[i];
    }

}

const fillReceiptItem=(normalizedTags)=>{

    let allReceiptItems = normalizedTags;


    for(let i = 0;i<normalizedTags.length;i++){
        let tmp = getItemInfo(normalizedTags[i].barcode);

        allReceiptItems[i].name = tmp.name;
        allReceiptItems[i].unit = tmp.unit;
        allReceiptItems[i].price = tmp.price;
    }

    return allReceiptItems;

}

const calculateSubTotalPrice=(price,count)=>{
    return price * count;
}

const calculateTotalPrice=(allReceiptItems)=>{

    let totalPrice = 0;
    for(let i = 0;i<allReceiptItems.length;i++){
        allReceiptItems[i].subTotalPrice = allReceiptItems[i].price * allReceiptItems[i].count;
        totalPrice += allReceiptItems[i].subTotalPrice;
    }

    return {"allReceiptItems":allReceiptItems,"totalPrice":totalPrice};

}

const isDiscount=(barcode)=>{
    let database = loadPromotions()[0].barcodes;
    for(let i = 0;i<database.length;i++){
        if(barcode === database[i])
            return true;
    }
    return false;
}

const calculateDiscount=(barcode,price,count)=>{
    if(isDiscount(barcode)){
        return count * price - Math.floor(count/3) * price;
    }else{
        return price * count;
    }
}

const calculateTotalDiscount=(allReceiptData)=>{

    let totalDiscount = 0;

    for(let i = 0;i<allReceiptData.allReceiptItems.length;i++){
        allReceiptData.allReceiptItems[i].sub
    }
}

const generateReceiptData=(tags)=>{
    return calculateTotalDiscount(calculateTotalPrice(fillReceiptItem(normalizeTag(tags))));
}











exports.splitTag = splitTag


