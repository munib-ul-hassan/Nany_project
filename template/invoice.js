

module.exports = (data)=>{
    let date = new Date().toLocaleString()
    
    date = date.split(',')[0]
    let total =0;
    data.product.map((item)=>{
        total= total + item.quantity*item.price
    })
    return(
    `<!DOCTYPE html>
<html lang="en">

<head>
    <style>
        body {
            overflow: hidden
        }

        .invoice {
            padding: 20px 40px;
        }

        .invoice p,
        span {
            margin: 0;
            color: rgba(0, 0, 0, 0.74);
            font-weight: 600;
        }

        .invoice h3 {
            color: #03396b;
            font-weight: 700;
        }

        .invoice h4 {
            color: #2796ce;
        }

        .invoice h5 {
            color: black;
            font-size: 24px;
            font-weight: 700;
            text-decoration: underline;
        }

        .invoice a {
            text-decoration: none;
            color: rgb(83, 79, 79);
            margin-top: 5px;
        }

        .invoice .table thead th {
            color: #03396b;
            text-transform: uppercase;
            background-color: #2796ce79;
        }

        .invoice .table {
            color: rgba(0, 0, 0, 0.74);
            font-weight: 600;
        }

        .invoice .border-text::before {
            content: '';
            border-bottom: 1px dotted gray;
            display: block;
            width: 200px;
            margin-left: auto;
            height: 4px;
        }

        .total{
            margin-left: 60%
        }
    </style>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <title>invoice</title>
</head>

<body>
    <div class="row">
        
        <div class="col-lg-6">
            <div class="invoice container">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <img src="data:image/png;base64,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"
                            alt="" height="100">
                    </div>
                    <div class="col-12 col-md-6 mt-5 ">
                        <p>Invoice #${data.id}</p>
                        <p>Date Issued: ${date}</p>
                    </div>
                    <div class="col-12 col-md-8 mt-4">
                        <h3>Invoice From</h3>
                        <h4>Care Inc</h4>
                        <a href="#" class="mt-5">clineinfo@careinc.com</a><br>
                        <a href="#">+237 697187304</a><br>
                        <a href="#">www.careinc.com</a><br>
                    </div>
                    <div class="col-12 col-md-4 mt-5">
                        <h5>invoice To:</h5>
                        <p>${data.order.name}</p>
                        <p>${data.order.address}</p>
                        <p>${data.order.postalCode}</p>
                        <p>${data.order.mobile}</p>
                    </div>
                </div>
                <table class="table mt-5">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">item</th>
                            <th scope="col">Price</th>
                            <th scope="col">qty</th>
                            <th scope="col">total</th>
                        </tr>
                    </thead>
                    ${
                        data.product.map((item,index)=>{
                            return(

                        `<tbody>
                            <tr>
                                <th scope="row">${index+1}</th>
                                <td>${item.name}</td>
                                <td>${item.price}</td>
                                <td>${item.quantity}</td>
                                <td>${item.price * item.quantity }</td>
    
                            </tr>
                        </tbody>`
                            )
                        })
                    }

                </table>
                <div class="total">
                    <span>Subtotal:</span> <span class="ml-4">${total}</span><br>
                    <span>Discount:</span> <span class="ml-4">${data.discount?data.discount:0}</span><br>
                    <span>Tax:</span> <span class="ml-4">${data.tax?data.tax:0}%</span><br>
                    <div class="border-text">
                        <span>Total:</span> <span class="ml-4">${total -(data.discount?data.discount:0)+( data.tax?data.tax:0 * total) }</span>
                    </div>
                </div>

            </div>

        </div>
    </div>
    </div>
    </body>
</html>
`)}