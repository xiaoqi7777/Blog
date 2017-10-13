
console.log('我是详情页的.js')
$('form').on('submit',function(e){
        e.preventDefault();
        //console.log('112233');
        let  textarea_body=this.body.value.trim();
        console.log(textarea_body);
          
        let id =$('#id').val()
        console.log('测试是否进入',id)
            $.ajax({
            //1 传参数 url:'/article/detail/?id='+id,
                url:'/article/detail/'+id,
                method:'post',
                data:{
                    body1:textarea_body
                },
                success:function(resp){
                    if(resp.success){
                        alert('评论成功');
                        //alert(resp.article.comments);
                        location.href='/article/detail/'+id;
                    }else{
                        alert('评论失败')
                    }
                }
            })
        })