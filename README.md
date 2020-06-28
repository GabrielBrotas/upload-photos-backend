# upload-photos-backend
  Neste backend vamos configurar a conexão com o mongodb e a amazon s3. Vamos pegar os dados do schema e criar rotas para que o nosso frontend possa listar os arquivos, adicionar ou excluir.

## Criar aplicação na AWS S3
  - Fazer login no Console da aws;
  - Ir nos serviços e procurar 's3';
  - Criar um bucket -> escolher nome e colocar na regiao US east (N. Virginia) que é a mais proxima
  - Depois desmarcar a opção 'block all public access', pois vamos querer ter acesso de outro servidor aos arquivos salvos aqui
  - Feito isso só criar o bucket
  - Com o bucket criado apenas configurar ele no backend do node...

  - No painel da AWS, Criaremos um usuario para que possa acessar/consumir esse bucket do s3

  - Services -> IAM -> Usuarios -> Criar um novo usuario
	 - Marcar "Acesso programatico" para liberar uma chave de acesso para acessar a API -> "Anexar politicas existentes de forma direta" e pesquisar por  "AmazonS3FullAccess" para que o usuario possa fazer upload de arquivos
	 - Finalizar criação;
  - Agora só configurar no backend.
  
  
## Criar banco de dados no cloud mongodb atlas
  - Ir no cloud mongodb atlas (https://www.mongodb.com/cloud);
  - Criar uma conta e um cluster gratuito;
  - Clicar no nome do cluster criado para abrir as configurações;
  - Dentro da configurações do Cluster ir em Collection para gerenciar o database;
  - Criar um database e definir o nome da collection (de preferencia colocar o mesmo do Schema criado, neste caso 'posts');

    DATABASE NAME = upload-example
    COLLECTION NAME = posts

  - Criado o Database vai estar disponivel nas collections para mais alterações;
  - Para testar a conexão vamos em 'Security' -> 'Network Accesss' e adicionar um ip address me 'IP whitelist'
  - Para permitir que todos os tipos de ip tenham acesso a nossa aplicação vamos clicar em "ALLOW ACCESS FROM ANYWHERE' e confirmar, caso contrario adicionar uma restrição

  - Agora vamos criar um user para ter acesso a essa API. em 'Database Access' -> 'Add New Database User';
  - Colocar com a opçao 'Read and write to any database' para poder ler os dados e adicionar;

  - Feito isso, agora vamos nos conectar com essa base de dados;
  - Em 'Clusters' vamos em 'Connect' e selecionar a opção 'connect your application' e copiar a url de conexão para definir como variavel ambiente no nosso deploy pela heroku;
  
  
## Deploy na Heroku
  - Ir no https://dashboard.heroku.com/apps <-heroku;
  - Criar um novo app para o backend desta aplicação; 
      new -> 'create new app', colocar o nome e a regiao do app;
      
  - Criado o app vamo escolher o deployment method
  - Vamos escolher a do Github, esse metodo vai fazer com que cada vez que detecte uma nova alteração no repositorio do github ele vai fazer um deploy automatico e reiniciar o server.
  - Fazer a conexao com a conta do github e colocar o nome do repositorio, nesse caso: 'upload-photos-backend'
  - Da um search e connect
  - E não esquece de clicar em 'enable automatic deploys' para permitir que detecte mudanças no repositorio

  - Na pasta do nosso app vamos criar um arquivo Procfile que só o heroku entende, este arquivo vai avisar pro heroku qual comando utilizar quando iniciar a aplicação

    conteudo do Procfile:
    web: yarn start
    caso sua aplicação tenha sido via npm você pode colocar 'npm start'
    
    yarn start é o nosso script localizado em 'package.json' ele vai executar o comando "start": "node src/index" já que na web nao precisamos do nodemon pois ele vai entender sempre que houver uma mudança no repositorio;
    web: é só para identificar qual comando deve ser executado

  - Agora no heroku vamos em 'Settings' para configurar as variaveis ambientes 
     'Config Vars' -> "Reveal Config Vars"
  - E adicionar nossas variaveis ambientes localizadas no .env e mudar os valores ex:

    APP_URL=https://upload-example-react-node.herokuapp.com/
    para pegar o eendereeço da aplicação ir em 'open app' com o botao direito e copiar o endereço do link

    MONGO_URL=mongodb+srv://gbrotas:<password>@cluster0-od5cw.mongodb.net/<dbname>?retryWrites=true&w=majority
    url do cluster trocando a senha e o dbname=upload-example

    STORAGE_TYPE=s3
    como ta em produção é para salvar na amazon s3

   restante...
   AWS_ACCESS_KEY_ID=AKIAYY3CX67JBUFF3POS
   AWS_SECRET_ACCESS_KEY=Tzvsktnr6HJq1cjDamE6IouZY5OeMpIzNohipLl9
   AWS_DEFAULT_REGION=us-east-1

  - Feito isso, agora vamos fazer o commit no github e realizar o deploy da aplicação

  - No overview podemos verificar o progresso do deploy.
