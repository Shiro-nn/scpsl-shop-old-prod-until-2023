const data = [
    {id: 1, name: 'NoRules'},
];
module.exports = {
    GetById: function(id){
        try{
            if(id == -1) return 'Все сервера';
            const server = data.find(x => x.id == id).name;
            if(server == null || server == undefined) server = '[data deleted]';
            return server;
        }catch{
            return '[data deleted]';
        }
    },
    GetAll: function(){
        return data;
    },
    Includes: function(id){
        return id == -1 || data.filter(x => x.id == id).length > 0;
    },
};