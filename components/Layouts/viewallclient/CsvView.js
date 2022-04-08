import React, { useState, useEffect } from 'react'
import CSVReader from 'react-csv-reader'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function CsvView({categories}){

    useEffect(() => {
        categories.forEach((x)=>{
            x.title=x.title.toLowerCase();
        })
        //console.log(categories)
    }, [])

    const getCategoryName = (ids) => {
        ids = ids.toLowerCase().split(', ')
        // console.log(ids);
        // console.log(ids.length);
        let values = ''
        for (let i = 0; i < ids.length; i++) {
            //console.log(i)
            for (let j = 0; j < categories.length; j++) {
                if (categories[j].title == ids[i].toLowerCase()) {
                    values = values + categories[j].id + ",";
                    //console.log(values)
                }
            }
        }
        return values
    }

    const createRecordTree = (records) => {
        let val = [];
        records.forEach((rec, index)=>{
            if(index===(records.length-1)){

            }else if(index>0){
                
                // let contact = [];
                // if (rec[14].indexOf(",") != -1 || rec[15].indexOf(",") != -1 || rec[16].indexOf(",") != -1) {
                //     let mobList = [], lineList = [], extList = [];
                //     rec[14].indexOf(",") != -1 ? mobList = rec[14].split(',') : mobList[0] = rec[14];
                //     rec[15].indexOf(",") != -1 ? lineList = rec[15].split(',') : lineList[0] = rec[15];
                //     rec[16].indexOf(",") != -1 ? extList = rec[16].split(',') : extList[0] = rec[16];
                //     for (let i = 0; i < Math.max(extList.length, lineList.length, mobList.length); i++) {
                //         contact[i] = { mobile: mobList[i] || mobList[0], landLine: lineList[i] || lineList[0], ext: extList[i] || extList[0] }
                //     }
                // } else { contact[0] = { mobile: rec[14], landLine: rec[15], ext: rec[16] } }
                
                if(records[index-1][0]!=rec[0] || index==1){
                    val.push({
                        companyName:rec[0],
                        ownerName:rec[1],
                        website: rec[2],
                        products: rec[3],
                        address: rec[4],
                        city: rec[5],
                        country: rec[6],
                        leadSource: rec[7],
                        memberOf: rec[8],
                        categories:getCategoryName(rec[9]),
                        contactList:[{
                            fName:rec[10], lName:rec[11], designation:rec[12], email:rec[13],
                            mobile:rec[14]+", ", landLine:rec[15]+", ", ext:rec[16]+", "
                        }]
                    })
                }else{
                    val[val.length-1].contactList.push({
                        fName:rec[10],lName:rec[11],designation:rec[12], email:rec[13],
                        mobile:rec[14]+", ", landLine:rec[15]+", " ,ext:rec[16]+", "
                    })
                }
            }
        })
        console.log(val);
        console.log('request made')
        axios.post(process.env.NEXT_PUBLIC_EVE_ADD_CLIENT_LIST,{addedBy: Cookies.get('loginId'),list:val}).then((x)=>console.log(x))
    }

    return(
        <CSVReader onFileLoaded={(data, fileInfo, originalFile) => createRecordTree(data) } />
    );
}