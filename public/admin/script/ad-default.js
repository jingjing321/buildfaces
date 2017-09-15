$("#ad-default-list").bootstrapTable({
    // url:"",
    idField:'id',
    pagination:true,
    data:[
        {1:"PC首页幻灯片广告位1",2:'2000/月，2万/年',3:3,4:"www.baidu.com",5:'操作'},
        {1:"PC首页幻灯片广告位1",2:'2000/月，2万/年',3:3,4:"www.baidu.com",5:'操作'}
    ],
    columns:[[
        {field:'1',title:'广告位置',align:"center"},
        {field:"2",title:"原价",align:'center'},
        {field:'3',title:'当前广告',align:'center',formatter:function(value,row,index){
            return "<img src='../images/logo_bs.png'/>"
        }},
        {field:'4',title:'链接地址',align:'center'},
        {field:'5',title:"操作",align:'center',formatter:function(value,row,index){
            return "<a href='#' data-toggle='modal' data-target='#ad-edit-modal'>编辑</a> <br/> <a href='#' data-toggle='modal' data-target='#ad-price-modal'>修改价格</a>"
        }}
    ]]
})