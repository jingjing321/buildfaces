$("#sell-report-list").bootstrapTable({
    // url:"",
    idField:'id',
    pagination:true,
    data:[
        {1:"PC首页幻灯片广告位1",2:'2000/月，2万/年',3:3,4:"www.baidu.com",5:'操作'},
        {1:"PC首页幻灯片广告位1",2:'2000/月，2万/年',3:3,4:"www.baidu.com",5:'操作'}
    ],
    columns:[[
        {field:'1',title:'时间段',align:"center"},
        {field:"2",title:"城市站点",align:'center'},
        {field:'3',title:'终端',align:'center'},
        {field:'4',title:'管理员账号',align:'center'},
        {field:'5',title:"销售总额",align:'center'},
        {field:'5',title:"详情",align:'center',formatter:function(value,row,index){
            return "<a href='#' data-toggle='modal' data-target='#sell-detail-modal'>详情记录</a>"
        }}
    ]]
});

$("#sell-detail-list").bootstrapTable({
    // url:"",
    idField:'id',
    pagination:true,
    data:[
        {1:"PC首页幻灯片广告位1",2:'2000/月，2万/年',3:3,4:"www.baidu.com",5:'操作'},
        {1:"PC首页幻灯片广告位1",2:'2000/月，2万/年',3:3,4:"www.baidu.com",5:'操作'}
    ],
    columns:[[
        {field:'1',title:'广告位',align:"center"},
        {field:"2",title:"购买时间段",align:'center'},
        {field:'3',title:'城市站点',align:'center'},
        {field:'4',title:'终端',align:'center'},
        {field:'5',title:"管理员账号",align:'center'},
        {field:'5',title:"金额",align:'center'}
    ]]
})