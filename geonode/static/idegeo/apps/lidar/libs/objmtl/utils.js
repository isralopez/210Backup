
function setNewViewPosition(x,y,z,offset){
  viewer.scene.view.position.set(x + offset,y + offset,z + offset);
  viewer.scene.view.lookAt(new THREE.Vector3(x,y,z));
}

/**

Cutom function to load OBJ files and append then into the POTREE rendering system.
Dependecies are a


*/
function loadFile() {
  var input, file, fr,name;

  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  input = document.getElementById('fileinput');
  if (!input) {
    alert("Um, couldn't find the fileinput element.");
  }
  else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  }
  else {
    file = input.files[0];
    name=file.name;
    fr = new FileReader();
    fr.onload = receivedText;//esta funcion se llama cuando se carga o hace la llamada readAsText
    fr.readAsText(file);


    //tengo un problema con la manera de cargar las cosas
    //ahora revisamos el mtllib
    // inputMtl = document.getElementById('fileinputMtl');
    // if(inputMtl.files[0]){
    //   file2 = inputMtl.files[0];
    //   fr2 = new FileReader();
    //   fr2.onload = receivedText;
    //   fr2.readAsText(file2);
    // }

  }

  function receivedText(e) {
    let lines = e.target.result;
    //let linesMtl = m.target.result;

    loadOBJMTLLocal(lines,null,name);
    //var newArr = JSON.parse(lines);

    //aqui es donde se cargan los objs
    //se recicla codgo de THREE.FileLoader
  }
}


/**
Function to loading an OBJ from the server
If a mtl file is not existant , then a null value should be passed
this works with the potree implementation for threejs
the object appears within the jstree_scene container into the OBJ section
*/

let objTreeName='3D Objects';
let objTreeId='3DObjects';

function loadOBJMTL(objFile,mtlFile){
  ////////////////////////////////////////////
  if(mtlFile){//ahora empleando un control de materiales

    //el mtlloader se carga antes de el objloader, con lo que las definiciones existen dentro del objloader
    new THREE.MTLLoader()
    .setPath( '' )
    .load( mtlFile,
      //		.setPath( 'obj/' )
      //		.load( 'Y19_treecrown_simple.mtl',
      function ( materials ) {

        materials.preload();//esto deberia cargar las definiciones dentro de el objloader

        new THREE.OBJLoader()
        .setMaterials( materials )
        //			.setPath( 'obj/' )
        //			.load( 'Y19_treecrown_simple.obj',
        .setPath( '' )
        .load( objFile,
          function ( object ) {//toda la definicion anterior

            setNewViewPosition(484859.000000,2149122.750000 ,2299.794434,250);//debo colocar esto en otro lado


            viewer.scene.scene.add( object );
            //la posicion final
            //		viewer.scene.view.position.set(484859.000000,2149122.750000 ,2299.794434);
            //		viewer.scene.view.lookAt(new THREE.Vector3(484829.000000,2149052.750000 ,2249.794434));
            //agregamos el objeto a la lista de contnido


            //////////////////////////////////////////////////
            //este codigo se tiene que hacer modular para que agregar elementos agrege las capas.
            let tree = $(`#jstree_scene`);
            //let otherID = tree.jstree('create_node', "#", { "text": "<b>Other</b>", "id": "other" }, "last", false, false);

            //main entry for the obj files, the entry itselfis JSON

            let MallaID=tree.jstree('get_node',objTreeId);
            console.log('El objeto ' + objTreeId + ' es ' + MallaID)
            if(!MallaID){
              MallaID = tree.jstree(
                'create_node',
                "#",//root node as no parent node exists and # means root
                { "text": "<b>"+ objTreeName+"</b>", "id": objTreeId }, //JSON
                "last", //position
                false, //callback
                false);//is loaded

              }


              let parentNode = objTreeId;//name o refer to the parent note
              let mallaID = tree.jstree('create_node', parentNode, {
                text: objFile,
                icon: `${Potree.resourcePath}/icons/triangle.svg`,
                data: object
              },
              "last", false, false);


              tree.jstree(object.visible ? "check_node" : "uncheck_node", mallaID);

            },//fin de funcion load
            // called when loading is in progresses
            function ( xhr ) {
              console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
              console.log( 'OBJ An error happened' );
            }
          )
        },
        function ( xhr ) {
          console.log( 'loading mtl' );
        },
        // called when loading has errors
        function ( error ) {
          console.log( 'An error happened while loading materials' );
        })
      }else {

        var loader = new THREE.OBJLoader();//este es el constructor que autoejecuta muchas cosas

        // el metodo recibe un url, una funcion que se llama cuando se carga, una onprogress y una de error
        loader.load(
          // resource URL
          //'obj/Y19_trees/Y19_trees_sqr.obj',
          objFile,//
          // called when resource is loadedl
          function ( object ) {
            viewer.scene.scene.add( object );
            //la posicion final
            //		viewer.scene.view.position.set(484859.000000,2149122.750000 ,2299.794434);
            //		viewer.scene.view.lookAt(new THREE.Vector3(484829.000000,2149052.750000 ,2249.794434));

            //////////////////////////////////////////////////
            //este codigo se tiene que hacer modular para que agregar elementos agrege las capas.
            let tree = $(`#jstree_scene`);
            //let otherID = tree.jstree('create_node', "#", { "text": "<b>Other</b>", "id": "other" }, "last", false, false);

            //main entry for the obj files, the entry itselfis JSON

            let MallaID=tree.jstree('get_node',objTreeId);
            console.log('El objeto ' + objTreeId + ' es ' + MallaID)
            if(!MallaID){
              MallaID = tree.jstree(
                'create_node',
                "#",//root node as no parent node exists and # means root
                { "text": "<b>"+ objTreeName+"</b>", "id": objTreeId }, //JSON
                "last", //position
                false, //callback
                false);//is loaded

              }


              let parentNode = objTreeId;//name o refer to the parent note
              let mallaID = tree.jstree('create_node', parentNode, {
                text: objFile,
                icon: `${Potree.resourcePath}/icons/triangle.svg`,
                data: object
              },
              "last", false, false);


              tree.jstree(object.visible ? "check_node" : "uncheck_node", mallaID);


            },

            // called when loading is in progresses
            function ( xhr ) {
              console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
              console.log( 'An error happened: '  + error);
            }
          )
        }//end else



      }

      /**
      Function to loading an OBJ from the server
      If a mtl file is not existant , then a null value should be passed
      this works with the potree implementation for threejs
      the object appears within the jstree_scene container into the OBJ section
      */



      function loadOBJMTLLocal(objFile,mtlFile,name){
        ////////////////////////////////////////////
        console.log('Carga archivo local.......');
        if(mtlFile){//ahora empleando un control de materiales

          //el mtlloader se carga antes de el objloader, con lo que las definiciones existen dentro del objloader
          new THREE.MTLLoader()
          .setPath( '' )
          .load( mtlFile,
            //		.setPath( 'obj/' )
            //		.load( 'Y19_treecrown_simple.mtl',
            function ( materials ) {

              materials.preload();//esto deberia cargar las definiciones dentro de el objloader

              new THREE.OBJLoader()
              .setMaterials( materials )
              //			.setPath( 'obj/' )
              //			.load( 'Y19_treecrown_simple.obj',
              .setPath( '' )
              .load( objFile,
                function ( object ) {//toda la definicion anterior

                  setNewViewPosition(484859.000000,2149122.750000 ,2299.794434,250);//debo colocar esto en otro lado


                  viewer.scene.scene.add( object );
                  //la posicion final
                  //		viewer.scene.view.position.set(484859.000000,2149122.750000 ,2299.794434);
                  //		viewer.scene.view.lookAt(new THREE.Vector3(484829.000000,2149052.750000 ,2249.794434));
                  //agregamos el objeto a la lista de contnido


                  //////////////////////////////////////////////////
                  //este codigo se tiene que hacer modular para que agregar elementos agrege las capas.
                  let tree = $(`#jstree_scene`);
                  //let otherID = tree.jstree('create_node', "#", { "text": "<b>Other</b>", "id": "other" }, "last", false, false);

                  //main entry for the obj files, the entry itselfis JSON

                  let MallaID=tree.jstree('get_node',objTreeId);
                  console.log('El objeto ' + objTreeId + ' es ' + MallaID)
                  if(!MallaID){
                    MallaID = tree.jstree(
                      'create_node',
                      "#",//root node as no parent node exists and # means root
                      { "text": "<b>"+ objTreeName+"</b>", "id": objTreeId }, //JSON
                      "last", //position
                      false, //callback
                      false);//is loaded

                    }


                    let parentNode = objTreeId;//name o refer to the parent note
                    let mallaID = tree.jstree('create_node', parentNode, {
                      text: objFile,
                      icon: `${Potree.resourcePath}/icons/triangle.svg`,
                      data: object
                    },
                    "last", false, false);


                    tree.jstree(object.visible ? "check_node" : "uncheck_node", mallaID);

                  },//fin de funcion load
                  // called when loading is in progresses
                  function ( xhr ) {
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                  },
                  // called when loading has errors
                  function ( error ) {
                    console.log( 'OBJ An error happened' );
                  }
                )
              },
              function ( xhr ) {
                console.log( 'loading mtl' );
              },
              // called when loading has errors
              function ( error ) {
                console.log( 'An error happened while loading materials' );
              })
            }else {

              var loader = new THREE.OBJLoader();//este es el constructor que autoejecuta muchas cosas

              // el metodo recibe un url, una funcion que se llama cuando se carga, una onprogress y una de error
              console.log("************************************")

              console.log("CArgando archivo local sin materiales")
              loader.loadLocal(
                // resource URL
                //'obj/Y19_trees/Y19_trees_sqr.obj',
                objFile,//
                // called when resource is loadedl
                function ( object ) {
                  console.log("Agregando Objeto ......")
                  viewer.scene.scene.add( object );
                  //la posicion final
                  //		viewer.scene.view.position.set(484859.000000,2149122.750000 ,2299.794434);
                  //		viewer.scene.view.lookAt(new THREE.Vector3(484829.000000,2149052.750000 ,2249.794434));

                  //////////////////////////////////////////////////
                  //este codigo se tiene que hacer modular para que agregar elementos agrege las capas.
                  let tree = $(`#jstree_scene`);
                  //let otherID = tree.jstree('create_node', "#", { "text": "<b>Other</b>", "id": "other" }, "last", false, false);

                  //main entry for the obj files, the entry itselfis JSON

                  let MallaID=tree.jstree('get_node',objTreeId);
                  console.log('El objeto ' + objTreeId + ' es ' + MallaID)
                  if(!MallaID){
                    MallaID = tree.jstree(
                      'create_node',
                      "#",//root node as no parent node exists and # means root
                      { "text": "<b>"+ objTreeName+"</b>", "id": objTreeId }, //JSON
                      "last", //position
                      false, //callback
                      false);//is loaded

                    }


                    let parentNode = objTreeId;//name o refer to the parent note
                    let mallaID = tree.jstree('create_node', parentNode, {
                      text: name,
                      icon: `${Potree.resourcePath}/icons/triangle.svg`,
                      data: object
                    },
                    "last", false, false);


                    tree.jstree(object.visible ? "check_node" : "uncheck_node", mallaID);


                  },

                  // called when loading is in progresses
                  function ( xhr ) {
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                  },
                  // called when loading has errors
                  function ( error ) {
                    console.log( 'An error happened: '  + error);
                  }
                )
              }//end else



            }
