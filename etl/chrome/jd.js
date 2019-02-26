// ==UserScript==
// @name         ������ƷͼƬ
// @namespace    https://hongchong.org
// @version      0.1
// @description  ������ƷͼƬ����
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
        labels: ["�����꼶", "���з���",$('input[name=bookClass]:checked').val()],
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


        //p��ǩ��ʽ
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

        //�ı���ʽ
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
<input type='radio' name='bookClass' id='bookClass' value='һ�꼶' checked=true>һ�꼶</input>\
<input type='radio' id='bookClass' id='bookClass' name='bookClass' value='���꼶'>���꼶</input>\
<input type='radio' id='bookClass' id='bookClass' name='bookClass' value='���꼶'>���꼶</input>\
<input type='radio' id='bookClass' id='bookClass' name='bookClass' value='���꼶'>���꼶</input>\
<input type='radio' id='bookClass' id='bookClass' name='bookClass' value='���꼶'>���꼶</input>\
<input type='radio' id='bookClass' id='bookClass' name='bookClass' value='���꼶'>���꼶</input>\
</div>\
");
    $(pEle).first().prepend(p);
}

(function() {
    'use strict';
    initUI( '//*[@id="name"]/div[1]', "�ɼ�", onCollect);
})();