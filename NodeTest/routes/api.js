/**
 * Created by Ben on 02/11/15.
 */

var express = require('express');
var router = express.Router();

router.get('/',function(req, res, next){
    res.send("Welcome to the API set")
})

router.get('/users',function(req,res,next){

    var ldap = require('ldapjs');
    var client = ldap.createClient({
        url:'ldap://python-dev:10389'
    });
    var allUsers = [];
    console.log(client);
    console.log('beginning search');

    var searchParameters = {
        filter: '(objectClass=person)',
        scope: 'sub',
        attributes: ['cn']
    };

    client.search('ou=users,DC=example,DC=com', searchParameters, function(err, searchResult){

        searchResult.on('searchEntry', function(entry){
            console.log('adding user');
            var userObj = {objectName: entry.objectName}
            allUsers.push(userObj);
        });

        searchResult.on('error', function(error){
            console.log('error');
            console.log(error);
            res.send(JSON.stringify(error));
        })

        searchResult.on('end', function(finalResult){
            console.log('final result is ' + finalResult.status);

            //res.json({users: allUsers});

            res.send({users: JSON.stringify(allUsers)});
        })

    });

})

router.get('/user', function(req,res,next){
    var searchCn = req.query.cn;
    console.log(searchCn);
    var ldap = require('ldapjs');
    var client = ldap.createClient({
        url:'ldap://python-dev:10389'
    });
    var allUsers = [];
    console.log(client);
    console.log('beginning search');

    var searchParameters = {
        filter: '(&(objectClass=person)(cn='+searchCn+'))',
        scope: 'sub',
        attributes: ['cn','sn','dn']
    };

    client.search('ou=users,DC=example,DC=com', searchParameters, function(err, searchResult){

        searchResult.on('searchEntry', function(entry){
            console.log('adding user');
            var userObj = {objectName: entry.objectName, cn: entry.cn, sn: entry.sn}
            allUsers.push(userObj);
        });

        searchResult.on('error', function(error){
            console.log('error');
            console.log(error);
            res.send(JSON.stringify(error));
        })

        searchResult.on('end', function(finalResult){
            console.log('final result is ' + finalResult.status);

            //res.json({users: allUsers});

            res.send({users: JSON.stringify(allUsers)});
        })

    });
})


module.exports = router;