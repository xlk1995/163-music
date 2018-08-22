// ES6 的局部变量；
{
    let view = {
        el:'.page>main',
        init(){
            this.$el = $(this.el)
        },
        template:`
            
            <form class="form">
                <div class="row" >
                    <label>
                        歌名
                    </label>
                    <input  name="name" type="text" value="__name__">
                </div>
                <div class="row">
                    <label>
                        歌手
                    </label>
                    <input name="singer" type="text" value="__singer__">
                </div>
                <div class="row">
                    <label>
                        外链
                    </label>
                    <input name="url" type="text" value="__url__">
                </div>
                <div class="row actions">
                    <button>保存</button>
                </div>
            </form>
        `,
        render(data={}){
            let placehoders = ['name','singer','url','id']
            let html = this.template
            placehoders.map((string)=>{
                html = html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html)
            if(data.id ){
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            }else{
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },
        reset(){
            this.render({})
        }
    }
    let model={
        data:{
            name:'',
            singer:'',
            url:'',
            id:''
        },
        create(data){
            // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name',data.name);
            song.set('singer',data.singer)
            song.set('url',data.url)

            // 设置优先级
            return song.save().then( (newSong)=> {
                let {id ,attributes} = newSong
                Object.assign(this.data,{
                    id,
                    ...attributes

                })
            }, (error) =>{
                console.error(error);
            });
        },
        update(data){
            // 第一个参数是 className，第二个参数是 objectId
            let  song = AV.Object.createWithoutData('Song', this.data.id);
            // 修改属性
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            // 保存到云端
            return song.save().then((response)=>{
                Object.assign(this.data,data)
                return response
            })
            }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('select',(data)=>{
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',(data)=>{
                    if(this.model.data.id){
                        this.model.data = {name:'',url:'',singer:'',id:''}
                    }else{
                        Object.assign(this.model.data,data)
                    }
                this.view.render(this.model.data)
            })
        },
        create(){
            let needs = 'name singer url'.split(' ')
            let data = {}
            needs.map((string)=>{
                data[string]=
                this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data)
                .then(()=>{
                    this.view.reset()
                    let string = JSON.stringify(this.model.data)
                    let object = JSON.parse(string)
                    window.eventHub.emit('create',object)
                })
        },
        update(){
            let needs = 'name singer url'.split(' ')
            let data = {}
            needs.map((string)=>{
                data[string]=
                this.view.$el.find(`[name="${string}"]`).val()
            })
            
            this.model.update(data)
                .then(()=>{
                    window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)) )
                })
           
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()

                if (this.model.data.id){
                    this.update()
                }else{
                    this.create()
                }
            })
        }
    }
    controller.init(view,model)
}