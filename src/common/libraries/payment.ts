declare const window: typeof globalThis & {
  IMP: any
}

export const purchaseProduct = (
  product: any,
  price: number,
  router: any,
  createPaymentSeries: any,
  seriesId: string,
) => {
  console.log(product) // [{…}, {…}, {…}, ...]
  console.log(seriesId)

  // const carts = JSON.parse(localStorage.getItem('carts') || '[]')
  // console.log('삭제 전 장바구니: ', carts)
  console.log(price)

  const IMP = window.IMP
  IMP.init('imp71265174') // 나의 식별코드 imp06164883 imp71265174 imp49910675

  // 결제창 호출 imp_685546850317
  IMP.request_pay(
    {
      pg: 'nice.nictest04m',
      pay_method: 'card',
      name: `시리즈 구매`,
      amount: price,
      buyer_email: 'gildong@gmail.com', // 유저 아이디(=메일)
      buyer_name: '홍길동', // 유저 이름
      m_redirect_url: `http://localhost:3000${router.pathname}`, // 모바일에서는 결제시, 결제페이지로 사이트가 이동되므로 돌아올시 주소입력(바로구매 페이지 또는 장바구니 페이지)
    },
    async (rsp: any) => {
      console.log('열리나')
      if (rsp.success) {
        console.log('열렸나')
        // console.log(product);

        // 결제 성공 시 로직,
        // 백엔드에 결제관련 데이터 넘겨주기  =>  API

        // ApolloError: Variable "$createPaymentInput" of required type "CreatePaymentInput!" was not provided.
        console.log(rsp) // Object {imp_uid: ""}

        const result = await createPaymentSeries({
          variables: {
            createPaymentInput: {
              impUid: rsp.imp_uid,
              amount: 100,
              seriesList: ['622d9455-16f8-4ea5-91e5-c30bc488a591'],
            },
          },
        })

        console.log(result)

        // 백엔드에서 받아온 ENUM 값인 status가 "성공"이면  =>  장바구니에서 결제한 상품을 제외하여 배열로 담기
        // const result = carts.filter((item: any) => {
        //   return !product.some((el: any) => el.id === item.id)
        // })
        // console.log('결제 제외 상품 : ', result)

        //  결제하지 않은 상품 localStorage에 저장
        // localStorage.setItem('carts', JSON.stringify(result))

        //  장바구니의 모든 아이템을 구매했을 때는 localStorage 비워주기
        // if (localStorage.getItem('carts') === '[]') {
        //   localStorage.removeItem('carts')
        // }
        alert('결제에 성공했습니다.')
        router.push('/my/paymentHistory')

        // 백엔드에서 받아온 ENUM 값인 status가 "실패"이면,
        //
      } else {
        // 결제 취소 시 로직,
        console.log('닫히나')
        alert('결제가 종료되었습니다. 다시 시도해 주세요.')
      }
    },
  )
}
