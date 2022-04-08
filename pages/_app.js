import React,{ useState } from 'react';
import '/styles/globals.css';
import '../styles/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import Layout from '/components/Shared/Layout';
import { wrapper } from '../redux/store';
//import Loader from '/components/shared/Loader';
import Loader from '../components/Shared/Loader'
import Router, { useRouter  } from 'next/router';
import 'aos/dist/aos.css'


function MyApp({ Component, pageProps:{ session, ...pageProps }, }) {

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  Router.events.on("routeChangeStart", () => { setLoading(true) });
  Router.events.on("routeChangeComplete", () => { setLoading(false)});

  return (
      <> 
      { router.pathname !='/signin' && 
          <Layout>
              { loading && <Loader/> }
              { !loading && <Component {...pageProps} /> }
          </Layout>
      }
      { router.pathname =='/signin' &&
        <Component {...pageProps} />
      }
      </>
  )
}

export default wrapper.withRedux(MyApp);