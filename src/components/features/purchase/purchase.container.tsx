import { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'
import PurchaseUI from './purchase.presenter'
import {
  IMutation,
  IMutationCreatePaymentFreeSeriesArgs,
  IMutationCreatePaymentSeriesArgs,
  IQuery,
  IQueryFetchSeriesArgs,
} from '@/common/types/generated/types'
import {
  CREATE_PAYMENT_FREE_SERIES,
  CREATE_PAYMENT_SERIES,
  FETCH_SERIES,
  FETCH_USER_LOGGED_IN,
} from './purchase.queries'

declare const window: typeof globalThis & {
  IMP: any
}

export default function Purchase() {
  const router = useRouter()
  const [seriesId, setSeriesId] = useState('')

  useEffect(() => {
    const buyNowSeries = localStorage.getItem('buySeriesId') || ''
    if (!buyNowSeries) {
      alert('상품을 찾을 수 없습니다. 메인페이지로 이동합니다.')
      router.push('/')
    }
    setSeriesId(buyNowSeries)
  }, [])

  const { data: userData } = useQuery<Pick<IQuery, 'fetchUserLoggedIn'>>(FETCH_USER_LOGGED_IN)

  const { data } = useQuery<Pick<IQuery, 'fetchSeries'>, IQueryFetchSeriesArgs>(FETCH_SERIES, {
    variables: { seriesId },
  })

  const [createPaymentSeries] = useMutation<Pick<IMutation, 'createPaymentSeries'>, IMutationCreatePaymentSeriesArgs>(
    CREATE_PAYMENT_SERIES,
  )

  const [createPaymentFreeSeries] = useMutation<
    Pick<IMutation, 'createPaymentFreeSeries'>,
    IMutationCreatePaymentFreeSeriesArgs
  >(CREATE_PAYMENT_FREE_SERIES)

  const imageErrorVisible = (event: ChangeEvent<HTMLImageElement>) => {
    event.target.src = '/images/no-image.jpeg'
  }

  const onClickPayment = async () => {
    //  구매금액이 0원일 때,
    if (data?.fetchSeries.price === 0) {
      try {
        const result = await createPaymentFreeSeries({
          variables: { seriesList: [data.fetchSeries.seriesId] },
        })
        //  console.log(result)
        alert('결제에 성공했습니다.')
        localStorage.removeItem('buySeriesId')
        router.push('/')
      } catch (error) {
        if (error instanceof Error) alert(error.message)
      }
      return
    }

    //  구매금액이 0원이 아닐 때,
    const IMP = window.IMP
    IMP.init('imp71265174')

    IMP.request_pay(
      {
        pg: 'nice.nictest04m',
        pay_method: 'card',
        name: `시리즈 ${data?.fetchSeries.title} 구매`,
        amount: Number(data?.fetchSeries.price),
        buyer_email: userData?.fetchUserLoggedIn.email,
        buyer_name: userData?.fetchUserLoggedIn.nickname,
        m_redirect_url: `http://localhost:3000${router.pathname}`, // 모바일에서는 결제시, 결제페이지로 사이트가 이동되므로 돌아올시 주소입력(바로구매 페이지 또는 장바구니 페이지)
      },
      async (rsp: any) => {
        if (rsp.success) {
          const result = await createPaymentSeries({
            variables: {
              createPaymentInput: {
                impUid: rsp.imp_uid,
                amount: Number(data?.fetchSeries.price),
                seriesList: [`${data?.fetchSeries.seriesId}`],
              },
            },
          })
          //  console.log(result)
          alert('결제에 성공했습니다.')
          localStorage.removeItem('buySeriesId')
          router.push('/')
        } else {
          // 결제 취소 시,
          alert('결제가 종료되었습니다. 다시 시도해 주세요.')
        }
      },
    )
  }

  return <PurchaseUI data={data} imageErrorVisible={imageErrorVisible} onClickPayment={onClickPayment} />
}
