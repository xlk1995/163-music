{
    let view = {
        el:'.page-1',
        init(){
            this.$el = $(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hidden(){
            this.$el.removeClass('active')
        }
    }
    let model={}
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvent()
            this.bindEventHub()
            this.loadModule1()
            this.loadModule2()
        },
        bindEvent(){},
        bindEventHub(){
            window.eventHub.on('selectTab',(tagName)=>{
                if(tagName === 'page-1'){
                    this.view.show()
                }else{
                    this.view.hidden()
                }
            })
        },
        loadModule1(){
            let script1 = document.createElement('script')
            script1.src = './js/index/page-1-1.js'
           
            script1.onload= function(){
                console.log('模块1加载成功')
            }
            document.body.appendChild(script1)
        },
        loadModule2(){
            let script2 = document.createElement('script')
            script2.src = './js/index/page-1-2.js'
            script2.onload=function(){
                console.log('模块2加载成功')
            }
            document.body.appendChild(script2)
        }
    }
    controller.init(view,model)
}