# API 使用文档

## **接口说明**

本 API 提供了一个问卷调查的数据存储系统。

其中，包括以下接口：

-   提交问卷调查数据的接口
-   查询所有问卷调查数据的接口
-   根据 ID 查询问卷调查数据的接口

## **接口文档**

### **1. 提交问卷调查数据的接口**

-   请求路径：/survey
-   请求方法：POST
-   请求参数：

|  **参数名**  | **类型** | **是否必选** |      **说明**      |
| :----------: | :------: | :----------: | :----------------: |
|     name     |  string  |      是      |      用户姓名      |
|     age      |  number  |      是      |      用户年龄      |
|    gender    |  string  |      是      |      用户性别      |
| surveyResult |  string  |      是      | 用户的问卷调查结果 |

-   返回参数：

| **参数名** | **类型** | **是否必选** |           **说明**           |
| :--------: | :------: | :----------: | :--------------------------: |
|    code    |  number  |      是      |          响应状态码          |
|  message   |  string  |      是      |           响应信息           |
|    data    |  object  |      是      | 提交成功后返回的问卷调查数据 |

-   示例：

请求示例：

```json

POST /survey HTTP/1.1
Content-Type: application/json

{
  "name": "张三",
  "age": 25,
  "gender": "男",
  "surveyResult": "非常满意"
}

```

响应示例：

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "code": 0,
  "message": "提交成功",
  "data": {
    "id": "3f4f44fd-7ad6-43b3-bd8e-5ac7a6c0a3a1",
    "name": "张三",
    "age": 25,
    "gender": "男",
    "surveyResult": "非常满意",
    "createdAt": 1621028020000
  }
}

```

### **2. 查询所有问卷调查数据的接口**

-   请求路径：/survey
-   请求方法：GET
-   请求参数：无
-   返回参数：

| **参数名** | **类型** | **是否必选** |        **说明**        |
| :--------: | :------: | :----------: | :--------------------: |
|    code    |  number  |      是      |       响应状态码       |
|  message   |  string  |      是      |        响应信息        |
|    data    |  array   |      是      | 所有问卷调查数据的数组 |

每个元素包含以下字段：

|  **参数名**  | **类型** |        **说明**        |
| :----------: | :------: | :--------------------: |
|      id      |  string  |   问卷调查数据的 ID    |
|     name     |  string  |        用户姓名        |
|     age      |  number  |        用户年龄        |
|    gender    |  string  |        用户性别        |
| surveyResult |  string  |   用户的问卷调查结果   |
|  createdAt   |  number  | 问卷调查数据的创建时间 |

-   示例：

请求示例：

```json
GET /survey HTTP/1.1
```

响应示例：

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "code": 0,
  "message": "查询成功",
  "data": [
    {
      "id": "3f4f44fd-7ad6-43b3-bd8e-5ac7a6c0a3a1",
      "name": "张三",
      "age": 25,
      "gender": "男",
      "surveyResult": "非常满意",
      "createdAt": 1621028020000
    },
    {
      "id": "a86e8ed4-7aa9-47d7-85b6-4c4d1f1b89fe",
      "name": "李四",
      "age": 30,
      "gender": "女",
      "surveyResult": "一般",
      "createdAt": 1621028000000
    }
  ]
}

```

### **3. 根据 ID 查询问卷调查数据的接口**

-   请求路径：/survey/:id
-   请求方法：GET
-   请求参数：

| **参数名** | **类型** | **是否必选** |         **说明**          |
| :--------: | :------: | :----------: | :-----------------------: |
|     id     |  string  |      是      | 要查询的问卷调查数据的 ID |

-   返回参数：

| **参数名** | **类型** | **是否必选** |           **说明**           |
| :--------: | :------: | :----------: | :--------------------------: |
|    code    |  number  |      是      |          响应状态码          |
|  message   |  string  |      是      |           响应信息           |
|    data    |  object  |      否      | 查询成功后返回的问卷调查数据 |

-   示例：

请求示例：

```json
GET /survey/3f4f44fd-7ad6-43b3-bd8e-5ac7a6c0a3a1 HTTP/1.1
```

响应示例：

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "code": 0,
  "message": "查询成功",
  "data": {
    "id": "3f4f44fd-7ad6-43b3-bd8e-5ac7a6c0a3a1",
    "name": "张三",
    "age": 25,
    "gender": "男",
    "surveyResult": "非常满意",
    "createdAt": 1621028020000
  }
}

```
