$("#ad-list").bootstrapTable({
    // url:"",
    idField:'id',
    pagination:true,
    data:[
        {1:111,2:222,3:333,4:444,5:5555,6:6666,7:7777,8:8888},
        {1:111,2:222,3:333,4:444,5:5555,6:6666,7:7777,8:8888},
        {1:111,2:222,3:333,4:444,5:5555,6:6666,7:7777,8:8888},
        {1:111,2:222,3:333,4:444,5:5555,6:6666,7:7777,8:8888}
    ],
    columns:[[
        {field:'1',title:'广告位置',align:"center"},
        {field:"2",title:"价格",align:'center'},
        {field:'3',title:'当前广告',align:'center',formatter:function(value,row,index){
            return "<img src='../images/logo_bs.png'>"
        }},
        {field:'4',title:'链接地址',align:'center'},
        {field:'5',title:"到期时间",align:'center'},
        {field:"6",title:'已预订时间',align:'center'},
        {field:'7',title:"点击数",align:'center'},
        {field:'8',title:"操作",align:'center',formatter:function(value,row,index){
            return "<a href='#' data-toggle='modal' data-target='#ad-detail-modal'>查看详情</a> &nbsp; 购买"
        }}
    ]]
});
$("#ad-detail-list").bootstrapTable({
    // url:"",
    idField:'id',
    pagination:true,
    data:[
        {1:111,2:"http://baidu.com",3:'2016-1-20',4:'2016-2-20',5:'admin',6:"2000"},
        {1:111,2:"http://baidu.com",3:'2016-1-20',4:'2016-2-20',5:'admin',6:"2000"},
        {1:111,2:"http://baidu.com",3:'2016-1-20',4:'2016-2-20',5:'admin',6:"2000"},
        {1:111,2:"http://baidu.com",3:'2016-1-20',4:'2016-2-20',5:'admin',6:"2000"}
    ],
    columns:[[
        {field:'1',title:'广告图片',align:"center",formatter:function(value,row,index){
            return "<img src='../images/logo_bs.png'>"
        }},
        {field:"2",title:"链接地址",align:'center'},
        {field:'3',title:'开始时间',align:'center'},
        {field:'4',title:'结束时间',align:'center'},
        {field:'5',title:"操作者",align:'center'},
        {field:"6",title:'支付金额',align:'center',formatter:function(value,row,index){
            return value+"元"
        }}
    ]]
})