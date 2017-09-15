$("#comment-list").bootstrapTable({
    // url:"",
    idField:'id',
    pagination:true,
    data:[
        {id:1,title:"mingbaimiba",name:"rerer",1:1,2:2,3:3},
        {id:2,title:"施工",name:"rerer",1:1,2:2,3:3}
    ],
    columns:[[
        {field:'id',checkbox:true,align:'center',align:'center'},
        {field:'id',title:'序号',align:"center",formatter:function(value,row,index){
            return row.id;
        }},
        {field:'title',title:'内容',align:'center'},
        {field:'title',title:'前台',align:'center',formatter:function(value,row,index){
            return "查看"
        }},
        {field:"name",title:'用户名',align:'center'},
        {field:'1',title:"时间",align:"center"},
        {field:'2',title:'是否通过',align:'center',formatter:function(value,row,index){
            return "已审核"
        }},
        {field:'3',title:'删除',align:'center',formatter:function(value,row,index){
            return "删除"
        }}
    ]]});