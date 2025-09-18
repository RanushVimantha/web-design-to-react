
const Partners = () => {
  const partners = [
    { name: "Partner 1", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIENDhMYXzFfGkxfTFB8xuXinIiYWU0VwSGBbc-EDlRALEwVoSXAG-dxNBjNHLIZEgF7XjyDNoYBTFA_iszP4F7fLbSG8FJbD8N8-EI0Pq9e41EJpA4ai_wer6zbNojTAp7N827nou-KgMLKztMqOwJuEKDk7iinE2SgglxWRWuApWeqt5HDCbEtxoHfrkBYSPH8eWVnPLPf6Nvg_hKCMd8QyTzluGzqjQPOhBZnyNTqlURHxutw3_Yu0wwCbl_y5cx3rVL7_XPrg" },
    { name: "Partner 2", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOIcjvKJpwFjtFdlI5h7DW8Zd9hkf3Y17KqaPqqjinNHlAysXE-2pmA0foYmr9llglDq-Wg5vtX-WFkdrkguASBmTDBQ_7aCIGy2PDyXQXvlyaBfUekOprb2-n61XI4jXcM1Y-KTQ_nRE84YeE4t1wENHLaSMGYx8KcmCJNCKgHnrgLmVkCd-v1o28454pYvP-vYwlbILeWAt_YzZ8ndRCVTyaPqOrTA1purRQUvHc4cOdXLSQFZB-iERMtfOe9GIKz7Wv3g5YiA4" },
    { name: "Partner 3", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqXgFloiD3sM1QnMiiV2Uzedw-4LxQVWq_sciJcW6Bbyu43t25b_DdPz1UZjiHyIF8IkQbe7xK7XXwrpQWeVcERd61k5ExJQiz8vxBwD-sDzU78Gldqa9GjJdxzkm2z6jNAbVLdd0K1YanNO2jW7nQWVd3a_hTnKD55NiC6Z4hGgssSneQGB69SIGsi9H83DeiMaX1pbOCPE8GHRRXnd-CE5XzXyxNBDA57Ib999CnGWZFUgkLMoI4bXi6Cw5S092-rJSwSaMerB4" },
    { name: "Partner 4", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5km4EVjX63OdtdJ7W4kHTOcV3XStRJh1fzi9uYRkFcK-FTMoiNPcEPsQ-jD8t2Iyxe5acZhW6DtftF3ENtUBBzEKyVxh-ZLIEzmTzWexZ_ha6HotmKijy4nj-WZjCKsmT8lBSH9mpsm-ZZVIen9s_wt3ppDfLb_4vQStm42fVXDIy26QU_Oc5cjnrflr5OK3g_jAmGs0MBDoo2-U_XjKFdE2ALjRgF_9SAqEa4hNJSs5BPRtDbVk0OZ_gP_Oio7StevlBsmbBVJc" },
    { name: "Partner 5", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCebZddxmnpYLj6wtTL_W6o0sHvfQyfccImfdNg-UOIw8IduIMxxjpJ5zFSY6_c5xtJBjdZKo4AtOCpZNI9jUKkapLdBfNOa24usv9ZJu2-YDGT52YPpSVWBfcoNKzDiOqvAklBQMdiJzhVZ92VYUmN6yffMWkYho_Xox3PqHptIBxxyQbEgw0S9as4WAVE9rIS9-qxOgr2GKcx5lta1hyTE0Ud0y2q2_f6FaVnNEkfp91e-c3s0yk-U54AVZ9B1uNwg6JjkOu0ljs" }
  ];

  return (
    <section className="py-24 px-10 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-2/3 w-[50vw] h-[50vw] bg-red-500/10 rounded-full blur-3xl -z-10 animate-aurora" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-2/3 w-[50vw] h-[50vw] bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-aurora" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col gap-6 text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight font-orbitron">
            Partners & <span className="text-shadow-cyan text-cyan-400">Sponsors</span>
          </h2>
          <p className="text-white/70 text-xl font-normal leading-normal max-w-3xl mx-auto">
            Fueling our ascent with the best in the industry. We are proud to be allied with leaders who share our vision.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="partner-logo-container relative flex items-center justify-center h-40 bg-white/5 rounded-lg p-6 transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              <img 
                alt={`${partner.name} Logo`}
                className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                src={partner.logo}
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <button className="group relative flex min-w-[200px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-16 px-8 bg-transparent text-white text-lg font-bold leading-normal tracking-widest uppercase border-2 border-cyan-400 transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.cyan.400)] mx-auto">
            <span className="absolute inset-0 bg-cyan-400 transition-all duration-300 ease-out transform -translate-x-full group-hover:translate-x-0"></span>
            <span className="relative z-10 flex items-center gap-2">
              View All Partners 
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Partners;