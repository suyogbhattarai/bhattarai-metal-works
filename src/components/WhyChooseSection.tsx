import { useState, useRef, useEffect } from 'react';
import { FaCog, FaIndustry, FaCube, FaDollarSign, FaClock, FaCheckCircle, FaTools, FaCalendarAlt, FaChartLine, FaUsers, FaShieldAlt } from 'react-icons/fa';
import gsap from "gsap";

export default function WhyChooseSection() {
  const [activeTab, setActiveTab] = useState('prototyping');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = {
    project: useRef(null),
    series: useRef(null),
    prototyping: useRef(null)
  };
  const firstText = useRef(null);
  const secondText = useRef(null);

  useEffect(() => {
    // Marquee animation
    const marqueeAnimation = () => {
      gsap.fromTo(
        firstText.current,
        { y: () => -firstText.current.scrollHeight / 2 },
        {
          y: 0,
          repeat: -1,
          duration: 150,
          ease: "linear",
        }
      );

      gsap.fromTo(
        secondText.current,
        { y: 0 },
        {
          y: () => -secondText.current.scrollHeight / 2,
          repeat: -1,
          duration: 150,
          ease: "linear",
        }
      );
    };
    marqueeAnimation();
    
    const activeRef = tabRefs[activeTab].current;
    if (activeRef) {
      setIndicatorStyle({
        width: activeRef.offsetWidth,
        left: activeRef.offsetLeft
      });
    }
  }, [activeTab]);

  const tabContent = {
    prototyping: {
      title: 'Go from CAD files to physical parts in days. Our platform helps you',
      highlight: 'make better products, faster.',
      benefits: [
        {
          icon: <FaCog className="text-4xl" />,
          title: 'Instant quotes',
          description: 'Immediate pricing 24/7. Upload your CAD files to our platform to receive an automated quote in seconds. Instantly validate costs without delay.'
        },
        {
          icon: <FaIndustry className="text-4xl" />,
          title: 'Production scaling',
          description: 'Keep the scaling of production in mind already in the prototyping phase. Our Project Engineers can assist you with design decisions, from material selection to part geometry to ensure cost-efficient production in later stages.'
        },
        {
          icon: <FaTools className="text-4xl" />,
          title: 'Manufacturability feedback',
          description: 'Iterate and improve your designs faster. Our platform automatically performs DFM analysis on your CAD files, providing instant feedback on manufacturability. Catch potential issues early to refine your design and accelerate your development cycle.'
        },
        {
          icon: <FaDollarSign className="text-4xl" />,
          title: 'Competitive pricing',
          description: 'Our platform intelligently pools similar orders and matches them to a specialist manufacturing partner, reducing high setup costs and material waste. For small or large orders, we deliver both competitive pricing and high-quality results, even for prototypes.'
        },
        {
          icon: <FaClock className="text-4xl" />,
          title: 'Short lead times',
          description: 'Get your parts quickly and keep your project on schedule. Our standard lead times are designed for a fast turnaround, with expedited turnaround available for even quicker delivery.'
        },
        {
          icon: <FaCheckCircle className="text-4xl" />,
          title: 'Guaranteed quality',
          description: 'All our manufacturing partners are rigorously vetted for quality and precision. We manage quality control across every step of the process, from material inspection to final delivery. Our comprehensive quality system ensures your components meet all specifications. We take full responsibility for delivering the quality you expect from start to finish.'
        }
      ],
      buttonText: 'Get Instant Quote'
    },
    series: {
      title: 'Leverage our network for a',
      highlight: 'resilient, cost-efficient supply chain',
      subtitle: 'for all your repeat manufacturing.',
      benefits: [
        {
          icon: <FaIndustry className="text-4xl" />,
          title: 'Production scaling',
          description: 'Ensure your business needs never outpace your production capacity. Whether your parts require a simple process or a connected, multi-stage workflow, our manufacturing partner network provides you with instant access to additional capacity enabling you to handle unpredictable demand and meet growth without sourcing new suppliers or hitting bottlenecks.'
        },
        {
          icon: <FaDollarSign className="text-4xl" />,
          title: 'Flexible payment terms',
          description: 'Improve cash flow and simplify budgeting. We offer flexible payment terms for eligible business accounts, making it simple to manage the financial side of large or recurring orders directly through our easy-to-use cloud manufacturing platform.'
        },
        {
          icon: <FaUsers className="text-4xl" />,
          title: 'Project management',
          description: "We're your dedicated production partner, managing every manufacturing stage of your production. We coordinate all processes and manufacturing partners, from initial machining to final finishing and assembly, ensuring quality and on-time delivery."
        },
        {
          icon: <FaDollarSign className="text-4xl" />,
          title: 'Competitive pricing',
          description: 'Our engineers analyze your requirements and select manufacturing partners with the optimal machinery and processes for your specific manufacturing needs. This focus on efficiency minimizes cycle times and drives down overall cost-per-unit.'
        },
        {
          icon: <FaClock className="text-4xl" />,
          title: 'On-time production',
          description: 'De-risk your supply chain and ensure consistent delivery. Our distributed network mitigates single-point-of-failure risks like machine downtimes. If one of our manufacturing partners faces an issue, we instantly re-route production to another partner to protect your deadlines and maintain continuity.'
        },
        {
          icon: <FaCheckCircle className="text-4xl" />,
          title: 'Guaranteed quality',
          description: 'Our partners manufacturing processes and manufacturing capabilities are rigorously vetted, and our QA team implements robust quality control plans. We constantly monitor for consistency, ensuring every batch meets your standards.'
        }
      ],
      buttonText: 'Get Quote'
    },
    project: {
      title: 'Access a network of vetted manufacturing partners through a',
      highlight: 'single, expert point of contact.',
      benefits: [
        {
          icon: <FaUsers className="text-4xl" />,
          title: '1-1 expert support',
          description: 'From your first project, you work with your dedicated Account Manager. They give advice on materials, processes, and recommend smart design changes to avoid the need for special tooling, all to help reduce costs and accelerate production.'
        },
        {
          icon: <FaDollarSign className="text-4xl" />,
          title: 'Flexible payment terms',
          description: 'Streamline your procurement and cash flow with our flexible payment terms. Eligible business accounts can apply for payment terms directly on our platform.'
        },
        {
          icon: <FaChartLine className="text-4xl" />,
          title: 'Project management',
          description: 'We simplify even the most complex production lifecycle, from primary manufacturing processes to final finishing and assembly. This is possible through our Multi-Stage Connected Manufacturing approach, where we handle all supplier coordination, process management, and logistics. You have a single point of contact, for even the most complex orders.'
        },
        {
          icon: <FaDollarSign className="text-4xl" />,
          title: 'Competitive pricing',
          description: 'Our intelligent pricing model means you get competitive pricing on every order. We select manufacturing partners at the right scale for different stages of the project to keep the costs as low as possible. This ensures you get the best possible price without compromising on quality.'
        },
        {
          icon: <FaClock className="text-4xl" />,
          title: 'Short lead times',
          description: 'Get your parts delivered faster. Our platform monitors supplier availability in real-time, automatically routing your order to partners with the quickest production. This dynamic process cuts out unnecessary delays and significantly reduces your overall lead time.'
        },
        {
          icon: <FaShieldAlt className="text-4xl" />,
          title: 'Guaranteed quality',
          description: 'Every manufacturing partner in our network is thoroughly vetted, and our dedicated QA team oversees each stage of production to ensure your parts meet all required specifications. We stand behind every order and take full responsibility for delivering the quality you expect.'
        }
      ],
      buttonText: 'Get Quote'
    }
  };

  const currentContent = tabContent[activeTab];

  return (
    <section className="py-12 md:py-20 relative px-3 sm:px-5 md:px-10 rounded-[3%] bg-gray-50 overflow-hidden">
      {/* Left Marquee */}
      <div className="absolute left-0 top-0 h-full flex overflow-hidden z-0 opacity-30 md:opacity-100">
        <div ref={firstText} className="flex flex-col">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 md:gap-4 mb-2 md:mb-4">
              <span className="text-metal-shine text-2xl md:text-[60px] font-bold hover:scale-110 hover:py-2 transition-all duration-300" style={{writingMode: 'vertical-rl', fontFamily: 'Unbounded, sans-serif'}}>
                FABRICATING
              </span>
              <span className="text-gray-400 text-xl md:text-3xl">•</span>
              <span className="text-metal-shine text-2xl md:text-[60px] font-bold hover:scale-110 hover:py-2 transition-all duration-300" style={{writingMode: 'vertical-rl', fontFamily: 'Unbounded, sans-serif'}}>
                DESIGN
              </span>
              <span className="text-gray-400 text-xl md:text-3xl">•</span>
              <span className="text-metal-shine text-2xl md:text-[60px] font-bold hover:scale-110 hover:py-2 transition-all duration-300" style={{writingMode: 'vertical-rl', fontFamily: 'Unbounded, sans-serif'}}>
                CONTRACTING
              </span>
              <span className="text-gray-400 text-xl md:text-3xl">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Marquee */}
      <div className="absolute right-0 top-0 h-full flex overflow-hidden z-0 opacity-30 md:opacity-100">
        <div ref={secondText} className="flex flex-col">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 md:gap-4 mb-2 md:mb-4">
              <span className="text-metal-shine text-2xl md:text-[60px] font-bold hover:scale-110 hover:py-2 transition-all duration-300" style={{writingMode: 'vertical-rl', fontFamily: 'Unbounded, sans-serif'}}>
                MANAGEMENT
              </span>
              <span className="text-gray-400 text-xl md:text-3xl">•</span>
              <span className="text-metal-shine text-2xl md:text-[60px] font-bold hover:scale-110 hover:py-2 transition-all duration-300" style={{writingMode: 'vertical-rl', fontFamily: 'Unbounded, sans-serif'}}>
                SELF PERFORM
              </span>
              <span className="text-gray-400 text-xl md:text-3xl">•</span>
              <span className="text-metal-shine text-2xl md:text-[60px] font-bold hover:scale-110 hover:py-2 transition-all duration-300" style={{writingMode: 'vertical-rl', fontFamily: 'Unbounded, sans-serif'}}>
                CONTRACTING
              </span>
              <span className="text-gray-400 text-xl md:text-3xl">•</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center text-gray-900 mb-8 md:mb-12 px-4">
          Why Choose Us?
          <div className="w-16 md:w-20 h-1 bg-[#f6423a] mx-auto mt-3 md:mt-4"></div>
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-8 md:mb-16 px-2">
          <div className="relative inline-flex bg-gray-200 rounded-full p-1">
            {/* Sliding indicator */}
            <div
              className="absolute bg-[#f6423a] rounded-full shadow-lg transition-all duration-300 ease-out"
              style={{
                width: indicatorStyle.width,
                left: indicatorStyle.left,
                top: '4px',
                bottom: '4px'
              }}
            />
            <button
              ref={tabRefs.project}
              onClick={() => setActiveTab('project')}
              className={`relative z-10 px-3 sm:px-6 md:px-8 py-2.5 md:py-3.5 rounded-full font-medium text-sm md:text-base transition-colors duration-300 flex items-center gap-2 ${activeTab === 'project'
                ? 'text-white'
                : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              <FaCube className="text-base md:hidden" />
              <span className="hidden md:inline">Project manufacturing</span>
              <span className="md:hidden text-xs">Project</span>
            </button>
            <button
              ref={tabRefs.series}
              onClick={() => setActiveTab('series')}
              className={`relative z-10 px-3 sm:px-6 md:px-8 py-2.5 md:py-3.5 rounded-full font-semibold text-sm md:text-base transition-colors duration-300 flex items-center gap-2 ${activeTab === 'series'
                ? 'text-white'
                : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              <FaIndustry className="text-base md:hidden" />
              <span className="hidden md:inline">Series manufacturing</span>
              <span className="md:hidden text-xs">Series</span>
            </button>
            <button
              ref={tabRefs.prototyping}
              onClick={() => setActiveTab('prototyping')}
              className={`relative z-10 px-3 sm:px-6 md:px-8 py-2.5 md:py-3.5 rounded-full font-semibold text-sm md:text-base transition-colors duration-300 flex items-center gap-2 ${activeTab === 'prototyping'
                ? 'text-white'
                : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              <FaCog className="text-base md:hidden" />
              <span className="hidden md:inline">Prototyping</span>
              <span className="md:hidden text-xs">Proto</span>
            </button>
          </div>
        </div>

   

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-10 md:gap-5 mb-10 md:mb-16 cursor-pointer">
          {currentContent.benefits.map((benefit, index) => (
            <div
              key={index}
              className="md:bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl md:shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mb-4 md:mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-lg  md:text-lg font-medium text-gray-900 mb-3 md:mb-5">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center px-4">
          <button className="px-8 md:px-10 py-3 md:py-4 bg-[#f6423a] hover:bg-[#e03229] text-white rounded-full text-base md:text-lg font-semibold transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto">
            {currentContent.buttonText}
          </button>
        </div>
      </div>

      <style jsx>{`
        .text-metal-shine {
          background-image: linear-gradient(
            120deg,
           #010d3c 0%,
          #010d3c 25%,
           #010d3c 50%,
            #010d3c 75%,
           #010d3c 100%
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.4s ease;
        }

        .text-metal-shine:hover {
          background-image: linear-gradient(
            120deg,
           #f6423a 0%,
           #f6423a 25%,
            #f6423a 50%,
            #f6423a 75%,
            #f6423a 100%
          );
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: brightness(1.15) contrast(1.05);
        }
      `}</style>
    </section>
  );
}