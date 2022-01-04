// import { Card, CardBody, CardText, Row, Col, Table } from 'reactstrap'
// const Logo = require('../file/logo2.png')
module.exports = (data)=>{
const id =234
    
    // console.log(data);
    return(
`
<!DOCTYPE html>
        <html lang="en">
            <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    
    .i{
        color:red;
    }
    </style>
</head>
<body>

<Card class='invoice-preview-card'>
<CardBody class='invoice-padding pb-0'>

<Row>
  <Col md="6">
  <div class='logo-wrapper'>
    <img class= 'image' width="170"/>
  </div>
  </Col>
  <Col md="6" class="text-right justify-ite">
  <div class='mt-md-0 mt-2'>
  <h4 class='i'>
    Invoice <span class='invoice-number'>${id}</span>
  </h4>
  <div class='d-inline-flex'>
    <p class='invoice-date-title'>Date Issued:</p>
    <p class='ml-1 font-weight-bold'>{data.invoice.issuedDate}</p>
  </div>
  
</div>
  </Col>
</Row>
<Row  class="mb-2">
  <Col md="8">
<h6 class='mb-2'>Invoice From:</h6>
  <h6 class='mb-25'>Care Inc</h6>
  <CardText class='mb-25'>Office 149, 450 South Brand Brooklyn</CardText>
  <CardText class='mb-25'>San Diego County, CA 91905, USA</CardText>
  <CardText class='mb-0'>+1 (123) 456 7691, +44 (876) 543 2198</CardText>
  </Col>
  <Col md="4">
  <h6 class='mb-2'>Invoice To:</h6>
  <h6 class='mb-25'>{data.invoice.client.name}</h6>
  <CardText class='mb-25'>{data.invoice.client.company}</CardText>
  <CardText class='mb-25'>{data.invoice.client.address}</CardText>
  <CardText class='mb-25'>{data.invoice.client.contact}</CardText>
  </Col>
  </Row>


</CardBody>





<Table responsive>
<thead>
<tr>
  <th class='py-1'>#</th>
  <th class='py-1'>Item</th>
  <th class='py-1'>Price</th>
  <th class='py-1'>Qty</th>
  <th class='py-1'>Total</th>
</tr>
</thead>
<tbody>
<tr>
  <td class='py-1'>

    1
  </td>
  <td class='py-1'>
    <span class='font-weight-bold'>4</span>
  </td>
  <td class='py-1'>
    <span class='font-weight-bold'>T-shirt</span>
  </td>
  <td class='py-1'>
    <span class='font-weight-bold'>5</span>
  </td>
  <td class='py-1'>
    <span class='font-weight-bold'>$450</span>
  </td>
</tr>
<tr class='border-bottom'>
  <td class='py-1'>

    2
  </td>
  <td class='py-1'>
    <span class='font-weight-bold'>Socks</span>
  </td>
  <td class='py-1'>
    <span class='font-weight-bold'>$20</span>
  </td>
  <td class='py-1'>
    <span class='font-weight-bold'>4</span>
  </td>
  <td class='py-1'>
    <span class='font-weight-bold'>$128</span>
  </td>
</tr>
</tbody>
</Table>

<CardBody class='invoice-padding pb-2'>
<Row class='invoice-sales-total-wrapper'>

<Col class='d-flex justify-content-end' md='12' order={{ md: 2, lg: 1 }}>
  <div class='invoice-total-wrapper'>
    <div class='invoice-total-item'>
      <p class='invoice-total-title'>Subtotal:</p>
      <p class='invoice-total-amount'>$1800</p>
    </div>
    <div class='invoice-total-item'>
      <p class='invoice-total-title'>Discount:</p>
      <p class='invoice-total-amount'>$28</p>
    </div>
    <div class='invoice-total-item'>
      <p class='invoice-total-title'>Tax:</p>
      <p class='invoice-total-amount'>21%</p>
    </div>
    <hr class='my-50' />
    <div class='invoice-total-item'>
      <p class='invoice-total-title'>Total:</p>
      <p class='invoice-total-amount'>$1690</p>
    </div>
  </div>
</Col>
</Row>
</CardBody>

</Card>
</body>
</html>`

//         `
//<!DOCTYPE html>
//         <html lang="en">
//             <head>
//     <meta charset="UTF-8">
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
// </head>
// <body>
//     <h1>
//         ${data.product[0].color}
//     </h1>
// </body>
// </html>`
)
}