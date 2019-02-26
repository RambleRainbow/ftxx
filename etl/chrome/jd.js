// ==UserScript==
// @name         京东商品图片
// @namespace    https://hongchong.org
// @version      0.1
// @description  京东商品图片链接
// @author       You
// @match        https://item.jd.com/*
// @grant        none
// ==/UserScript==

function xpathElement(path) {
    return document.evaluate(path, document.body, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE).iterateNext();
}

function onCollect() {
    let content = {
        urls: [],
        name: "",
        labels: ["所有年级", "所有分类",$('input[name=bookClass]:checked').val()],
        coverImage:"",
        images: [],
        descs: []
    };

    content.urls.push(document.location.href);

    //name
    let eleBookName = xpathElement('//*[@id="crumb-wrap"]/div/div[1]');
    content.name = $(eleBookName).children().last().text();

    //img
    let ele = xpathElement('//*[@id="spec-list"]/div/ul');
    let imgs = $(ele).find('img');
    imgs.each( (idx, ele) => {
        content.images.push(ele.src.replace(/\/n5\//, "/n1/"));
    });
    content.coverImage = content.images[0];

    //desc
    $("div[id^=detail-tag-id]").each( (idx, ele) => {
        let itm = {
            name: "",
            desc: []
        };

        itm.name = $(ele).attr("text");


        //p标签格式
        $(ele).find('p').each( (idx, ele) => {
            if($(ele).text() !== "") {
                let lines = $(ele).html().replace(/<br>/ig,"\n")
                .split("\n")
                .map( l => { return l.trim();})
                .filter( l => {
                    if(l.trim() === "" ) {
                        return false;
                    }
                    if(l.charAt(0) === "<") {
                       return false;
                    }
                    return true;
                })
                itm.desc = itm.desc.concat(lines);
            }
        });

        //文本格式
        if(itm.desc.length === 0) {
          $(ele).find(".book-detail-content").each( (idx, eleContent) => {
              let h = eleContent.innerHTML;
              itm.desc = h.replace(/<br>/ig, "\n")
                  .split("\n")
                  .map( l => { return l.trim();})
                  .filter( (l) => {
                      if(l.trim() === ""){
                          return false;
                      }
                      if(l.charAt(0) === "<") {
                          return false;
                      }
                      return true;
                  });
          });
        }
        if(itm.desc.length !== 0) {
            content.descs.push(itm);
        }


    });

    $.ajax({
        url: "http://localhost:3000/api/v1/books",
        type: "POST",
        dataType: "json",
        data: content,
        success(res) {
        }

    });


    console.log(content);
}

function initUI( xpath, name, onclick) {
    let pEle = xpathElement(xpath);
    let btn = $(`<button>${name}</button>`);
    btn.click(onclick);
    $(pEle).first().prepend(btn);

    let p =$("\
<div>\
<input type='radio' name='bookClass' id='bookClass' value='一年级' checked=true>一年级</input>\
<input type='radio' id='bookClass' id='bookClass' name='bookClass' value='二年级'>二年级</input>\
<input type='radio' id='bookClass' id='bookClass' name='bookClass' value='三年级'>三年级</input>\
<input type='radio' id='bookClass' id='bookClass' name='bookClass' value='四年级'>四年级</input>\
<input type='radio' id='bookClass' id='bookClass' name='bookClass' value='五年级'>五年级</input>\
<input type='radio' id='bookClass' id='bookClass' name='bookClass' value='六年级'>六年级</input>\
</div>\
");
    $(pEle).first().prepend(p);
}

(function() {
    'use strict';
    initUI( '//*[@id="name"]/div[1]', "采集", onCollect);
})();