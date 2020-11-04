import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class LetscodecdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // -3 lambda functions
    // -1 DynamoDB table
    // -1 API gateway

    //--- Dynamodb
    const table = new dynamodb.Table(this, "people", {
      partitionKey: {
        name: "name",
        type: dynamodb.AttributeType.STRING,
      },
      tableName: "userTable",
    });

    // ---hello lambda---
    const welcomeLambda = new lambda.Function(this, "welcomeLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "hello.handler",
    });

    // api gateway
    const api = new apigw.RestApi(this, "helloApi");
    const apiHelloInteg = new apigw.LambdaIntegration(welcomeLambda);
    const apiHello = api.root.addResource("hello");
    apiHello.addMethod("GET", apiHelloInteg);

    // create Lambda
    const createLambda = new lambda.Function(this, "createHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("lambda"),
      environment: { TABLE_NAME: "userTable" },
      handler: "createUser.handler",
    });

    // api gateway

    const apiCreateInteg = new apigw.LambdaIntegration(createLambda);
    const apiCreate = api.root.addResource("create");
    apiCreate.addMethod("POST", apiCreateInteg);

    // read Lambda
    const readLambda = new lambda.Function(this, "readHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("lambda"),
      environment: { TABLE_NAME: "userTable" },
      handler: "readUser.handler",
    });

    // api gateway
    const apiReadInteg = new apigw.LambdaIntegration(readLambda);
    const apiRead = api.root.addResource("read");
    apiRead.addMethod("GET", apiReadInteg);
    // permissions
    table.grantReadData(readLambda);
    table.grantWriteData(createLambda);
  }
}
