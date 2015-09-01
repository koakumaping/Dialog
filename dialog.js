/**
 *
 * @param $
 * @param $UI
 * @constructor
 * @author: ping yifeng
 * 依赖: jQuery,jQueryUI
 */

function Dialog($, $UI){
    this.cfg = {
        width: 500,
        height: 300,
        title: '系统消息',
        content: '',
        defaultInputValue: '',

        skinClassName: null,

        alterBtnText: '确定',
        confirmBtnConfirmText: '确定',
        confirmBtnCancelText: '取消',
        promptBtnConfirmText: '输入完成',
        promptBtnCancelText: '取消',

        dragAble: true,
        isPassword: false,

        handler: null,
        handler_close: null,
        handler_confirm: null,
        handler_prompt: null,
        handler_cancel: null,
        handler_drag: '.dialog_header',

        hasCloseBtn: true,
        mask: true
    };

    this.handlers = {

    }
}

Dialog.prototype = {

    on: function(type, handler){
        if(typeof this.handlers[type] == 'undefined'){
            this.handlers[type] = [];
        }
        this.handlers[type].push(handler);
        return this;
    },

    fire: function(type, data){
        if(this.handlers[type] instanceof Array){
            var handlers = this.handlers[type];
            for(var index= 0, len = handlers.length; index<len; index++){
                handlers[index](data);
            }
        }
    },

    //方法：渲染组件
    render:function(container){
        this.renderUI();
        this.handlers={};
        this.bindUI();
        this.syncUI();
        $(container||document.body).append(this.boudingBox);
    },

    //方法：渲染组件
    destroy:function(){
        this.destructor();
        this.boudingBox.off();
        this.boudingBox.remove();
    },

    //接口：添加dom节点
    renderUI:function(){
        var footerContent='';

        switch(this.cfg.winType){
            case "alert":
                footerContent = '<button type="button" class="dialog_return"><span>'+ this.cfg.alterBtnText+'</span></button>';
                break;
            case "confirm":
                footerContent='<button type="button" class="dialog_confirm"><span>' + this.cfg.confirmBtnConfirmText+ '</span></button>'+
                    '<button type="button" class="dialog_cancel"><span>' + this.cfg.confirmBtnCancelText + '</span></button>';
                break;
            case "prompt":
                this.cfg.content+= '<div class="dialog_input">' +
                    '<input id="dialog_input_val" value="' +this.cfg.defaultInputValue+'"'+ 'type="' + (this.cfg.isPassword?'password':'text') + '"'+ '>' +
                '</div>';
                footerContent='<button type="button" class="dialog_prompt"><span>' + this.cfg.promptBtnConfirmText+ '</span></button>'+
                    '<button type="button" class="dialog_cancel"><span>' + this.cfg.promptBtnCancelText+ '</span></button>';
                break;
        }

        this.boudingBox = $(
            '<div class="dialog_boundingBox">'+
            '<div class="dialog_header">'+this.cfg.title+'</div>'+
            '<div class="dialog_body">'+this.cfg.content+'</div>'+
            '<div class="dialog_footer">'+footerContent+'</div>'+
            '</div>'
        );
        /*处理模态*/
        if (this.cfg.mask) {
            this._mask = $('<div id="dialog_overlay" style="display: block;"></div>');
            this._mask.appendTo("body");
        }

        if(this.cfg.hasCloseBtn){
            this.boudingBox.append('<span class="dialog_closeBtn">X</span>');
        }
        this.boudingBox.appendTo(document.body);
        this._promptInput = this.boudingBox.find('#dialog_input_val');
    },

    //接口：监听事件
    bindUI:function(){
        var that = this;
        this.boudingBox.delegate(".dialog_return","click",function(){
            that.fire('alert');
            that.destroy();
        }).delegate(".dialog_closeBtn","click",function(){
            that.fire('close');
            that.destroy();
        }).delegate(".dialog_confirm","click",function(){
            that.fire('confirm');
            that.destroy();
        }).delegate(".dialog_cancel","click",function(){
            that.fire('cancel');
            that.destroy();
        }).delegate(".dialog_prompt","click",function(){
            that.fire('prompt',that._promptInput.val());
            that.destroy();
        });
        if (this.cfg.handler) {
            this.on('alert',this.cfg.handler);
        }
        if (this.cfg.handler_confirm) {
            this.on('confirm',this.cfg.handler_confirm);
        }
        if (this.cfg.handler_close) {
            this.on('close',this.cfg.handler_close);
        }
        if (this.cfg.handler_prompt) {
            this.on("prompt",this.cfg.handler_prompt);
        }
    },

    //接口：初始化组件属性
    syncUI:function(){
        this.boudingBox.css({
            width:this.cfg.width + 'px',
            height:this.cfg.height + 'px',
            left:(this.cfg.x||(window.innerWidth-this.cfg.width)/2) + 'px',
            top:(this.cfg.y||(window.innerHeight-this.cfg.height)/2) + 'px'
        });
        if (this.cfg.skinClassName) {
            this.boudingBox.addClass(this.cfg.skinClassName);
        }
        if (this.cfg.dragAble) {
            if (this.cfg.dragAble) {
                this.boudingBox.draggable({handle:this.cfg.handler_drag});
            }else{
                this.boudingBox.draggable();
            }
        }
    },

    //接口：销毁前的处理函数
    destructor:function(){
        this._mask && this._mask.remove();
    },

    alert:function(cfg){
        $.extend(this.cfg,cfg,{winType:'alert'});
        this.render();
        return this;
    },

    confirm:function(cfg){
        $.extend(this.cfg,cfg,{winType:'confirm'});
        this.render();
        return this;
    },

    prompt:function(cfg){
        $.extend(this.cfg,cfg,{winType:'prompt'});
        this.render();
        this._promptInput.focus();
        return this;
    }
};