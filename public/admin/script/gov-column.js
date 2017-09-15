$("#column-list").bootstrapTable({
    // url:"",
    idField:'id',
    pagination:true,
    data:[
        {id:1,title:"施工",father:0,num:1,1:1},
        {id:2,title:"施工",father:1,num:1,1:1}
    ],
    columns:[[
        {field:'id',title:'FID'},
        {field:'title',title:'栏目名称',formatter:function(value,row,index){
            if(row.father==0){
                return "["+value+"]";
            }
            else{
                return '|----'+value;
            }
        }},
        {field:"num",title:'排序'},
        {field:'1',title:"操作",formatter:function(value,row,index){
            return '<a href="#">编辑</a> &nbsp;&nbsp; <a href="#">删除</a>'
        }}
    ]]});