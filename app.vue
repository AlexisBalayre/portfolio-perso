<template>
  <div
    class="bg-[#09162E] grid min-w-screen h-full min-h-screen max-w-screen overflow-x-hidden"
  >
    <!--==========================================
                  HEADER
    ===========================================-->
    <div
      class="grid-flow-col grid lg:pb-5 w-screen h-fit md:pt-8 pb-4 md:pl-8 md:pr-8 pt-4 pl-4 pr-4"
    >
      <h1
        class="font-sans lg:text-2xl text-xl text-center text-white font-medium justify-self-start"
      >
        Alexis Balayre
      </h1>
      <div class="justify-self-end flex">
        <!-- Phone -->
        <a class="lg:pl-4 lg:pr-4 lg-2 pr-2" href="tel:+33695831470">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            class="w-8 h-8"
          >
            <path
              fill-rule="evenodd"
              d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
        <!-- Email -->
        <a class="lg:pl-4 lg:pr-4 lg-2 pr-2" href="mailTo:alexis@balayre.xyz">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            class="w-8 h-8"
          >
            <path
              d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"
            />
            <path
              d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"
            />
          </svg>
        </a>
        <!-- Github -->
        <a
          class="lg:pl-4 lg:pr-4 lg-2 pr-2"
          href="https://github.com/AlexisBal"
          target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
            class="w-8 h-8"
            fill="white"
          >
            <path
              fill="white"
              d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
            />
          </svg>
        </a>
        <!-- Linkedin -->
        <a
          class="lg:pl-4 lg:pr-4 lg-2 pr-2"
          href="https://fr.linkedin.com/in/alexis-balayre"
          target="_blank"
        >
          <svg
            class="w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            fill="white"
          >
            <path
              d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
            ></path>
          </svg>
        </a>
        <!-- Twitter -->
        <a class="lg:pl-4" href="https://twitter.com/Belas_Eth" target="_blank">
          <svg
            class="w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path
              d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
            />
          </svg>
        </a>
      </div>
    </div>

    <!--==========================================
                  ABOUT ME
    ===========================================-->
    <div
      class="ring-offset-white ring-offset-1/2 ring-white/20 ring-1 bg-indigo-200/10 grid p-6 md:pl-8 md:pr-8 mr-8 ml-8 md:ml-20 md:mr-20 mt-5 md:mt-10 md:mt-4 rounded-xl md:w-1/2 justify-self-center md:mt-20 mb-16"
    >
      <div class="w-1/5 w-1/5 rounded-full justify-self-center">
        <img
          class="h-full w-full rounded-full"
          src="./assets/img/alexis.png"
          alt="profile-picture"
        />
      </div>
      <div class="justify-self-center mt-6">
        <div
          x-data="{
        text: 'Data Engineer',
        textArray : ['Data Engineer', 'Blockchain Developer', 'Full Stack Developer'],
        textIndex: 0,
        charIndex: 0,
        typeSpeed: 110,
        cursorSpeed: 550,
        pauseEnd: 1500,
        pauseStart: 20,
        direction: 'forward',
    }"
          x-init="$nextTick(() => {
        let typingInterval = setInterval(startTyping, $data.typeSpeed);
    
        function startTyping(){
            let current = $data.textArray[ $data.textIndex ];
            
            // check to see if we hit the end of the string
            if($data.charIndex > current.length){
                    $data.direction = 'backward';
                    clearInterval(typingInterval);
                    
                    setTimeout(function(){
                        typingInterval = setInterval(startTyping, $data.typeSpeed);
                    }, $data.pauseEnd);
            }   
                
            $data.text = current.substring(0, $data.charIndex);
            
            if($data.direction == 'forward')
            {
                $data.charIndex += 1;
            } 
            else 
            {
                if($data.charIndex == 0)
                {
                    $data.direction = 'forward';
                    clearInterval(typingInterval);
                    setTimeout(function(){
                        $data.textIndex += 1;
                        if($data.textIndex >= $data.textArray.length)
                        {
                            $data.textIndex = 0;
                        }
                        typingInterval = setInterval(startTyping, $data.typeSpeed);
                    }, $data.pauseStart);
                }
                $data.charIndex -= 1;
            }
        }
                    
        setInterval(function(){
            if($refs.cursor.classList.contains('hidden'))
            {
                $refs.cursor.classList.remove('hidden');
            } 
            else 
            {
                $refs.cursor.classList.add('hidden');
            }
        }, $data.cursorSpeed);

    })"
          class="flex items-center justify-center mx-auto text-center max-w-7xl text-white h-full"
        >
          <div class="relative flex items-center justify-center">
            <p class="text-2xl text-white leading-tight" x-text="text"></p>
            <span
              class="absolute right-0 w-2 -mr-2 bg-black h-3/4"
              x-ref="cursor"
            ></span>
          </div>
        </div>
      </div>
      <div class="justify-self-center mt-6">
        <p class="text-lg text-left md:text-justify self-center text-white">
          My name is Alexis Balayre and I am a French
          <a class="text-lg font-bold">digital engineering</a> student
          specialising in <a class="text-lg font-bold">Data Intelligence</a>. I
          am currently doing an
          <a class="text-lg font-bold"
            >MSc in Computational and Software Techniques in Engineering -
            Computational Intelligence for Data Analytics</a
          >
          at <a class="text-lg font-bold">Cranfield University</a>. <br /><br />
          I am also a
          <a class="text-lg font-bold">Full Stack Web</a> and<a
            class="text-lg font-bold"
          >
            Blockchain Developer</a
          >
          specialized in <a class="text-lg font-bold">Web3</a>. I realize all
          the missions related to the creation of a
          <a class="text-lg font-bold">decentralized application (DApp)</a> from
          <a class="text-lg font-bold">smart contracts</a> to the
          <a class="text-lg font-bold">user interface</a>.
        </p>
      </div>
    </div>

    <!--==========================================
                  EDUCATION
    ===========================================-->
    <div class="justify-self-center mr-8 ml-8 md:ml-20 md:mr-20">
      <h2 class="text-2xl font-bold text-center text-white">Education</h2>
      <Timeline :items="formation" />
    </div>

    <!--==========================================
                  EXPERIENCE
    ===========================================-->
    <div class="justify-self-center mr-8 ml-8 md:ml-20 md:mr-20 mt-10">
      <h2 class="text-2xl font-bold text-center text-white">Experience</h2>
      <Timeline :items="experience" />
    </div>

    <!--==========================================
                  SKILLS
    ===========================================-->
    <div class="justify-self-center mr-8 ml-8 md:ml-20 md:mr-20 mt-10">
      <h2 class="text-2xl font-bold text-center text-white">Skills</h2>
      <Skills :items="skillCategories" />
    </div>

    <!--==========================================
                  SERVICES
    ===========================================-->
    <div class="justify-self-center mr-8 ml-8 md:ml-20 md:mr-20 mt-16">
      <h2 class="text-2xl font-bold text-center text-white">Services</h2>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <ServiceCard
          v-for="service in services"
          :key="service.id"
          :icon="service.icon"
          :title="service.title"
          :description="service.description"
        />
      </div>
    </div>

    <!--==========================================
                  TECHNOLOGIES
    ===========================================-->
    <div
      class="ring-offset-white ring-offset-1/2 ring-white/20 ring-1 bg-indigo-200/10 h-fit w-screen max-w-screen p-6 flex overflow-hidden md:mt-16 mt-10"
    >
      <div class="flex w-screen max-w-screen animate-slidein">
        <img
          class="lg:h-10 lg:w-20 w-10 h-5 mr-8 ml-8 self-center"
          src="./assets/img/AirflowLogo.png"
          alt="AirflowLogo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"
          src="./assets/img/apache-logo.svg"
          alt="apache-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"
          src="./assets/img/cassandra_logo.svg"
          alt="cassandra-logo"
        />
        <img
          class="lg:h-10 lg:w-20 w-10 h-5 mr-8 ml-8 self-center"
          src="./assets/img/elastic-logo.png"
          alt="elastic-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"
          src="./assets/img/InfluxDB-Logo.svg"
          alt="influxDB-logo"
        />
        <img
          class="lg:h-10 lg:w-20 w-10 h-5 mr-8 ml-8 self-center"
          src="./assets/img/kafka-logo.png"
          alt="kafka-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"
          src="./assets/img/MongoDB-Logo.svg"
          alt="mongoDB-logo"
        />
        <img
          class="lg:h-15 lg:w-20 w-10 h-5 mr-8 ml-8 self-center"
          src="./assets/img/Neo4j-logo.png"
          alt="neo4j-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"
          src="./assets/img/spark-logo.svg"
          alt="spark-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"
          src="./assets/img/docker-logo.png"
          alt="docker-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"
          src="./assets/img/vs-logo.png"
          alt="vs-code-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"
          src="./assets/img/typescript-logo.svg"
          alt="typescript-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"
          src="./assets/img/solidity-logo.png"
          alt="solidity-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-4 self-center"
          src="./assets/img/remix-logo.png"
          alt="remix-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"
          src="./assets/img/hardhat-logo.png"
          alt="hardhat-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"
          src="./assets/img/foundry-logo.png"
          alt="foundry-logo"
        />
        <img
          class="lg:h-20 lg:w-24 w-12 h-10 ml-8 self-center"
          src="./assets/img/ethersjs-logo.png"
          alt="ethersjs-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"
          src="./assets/img/web3js-logo.png"
          alt="web3js-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"
          src="./assets/img/nest-logo.png"
          alt="nest-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"
          src="./assets/img/nuxtjs-logo.png"
          alt="nuxtjs-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"
          src="./assets/img/react-logo.png"
          alt="react-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"
          src="./assets/img/docker-logo.png"
          alt="docker-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"
          src="./assets/img/vs-logo.png"
          alt="vs-code-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"
          src="./assets/img/typescript-logo.svg"
          alt="typescript-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"
          src="./assets/img/solidity-logo.png"
          alt="solidity-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-4 self-center"
          src="./assets/img/remix-logo.png"
          alt="remix-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-8 ml-8 self-center"
          src="./assets/img/hardhat-logo.png"
          alt="hardhat-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"
          src="./assets/img/foundry-logo.png"
          alt="foundry-logo"
        />
        <img
          class="lg:h-20 lg:w-24 w-12 h-10 ml-8 self-center"
          src="./assets/img/ethersjs-logo.png"
          alt="ethersjs-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"
          src="./assets/img/web3js-logo.png"
          alt="web3js-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"
          src="./assets/img/nest-logo.png"
          alt="nest-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"
          src="./assets/img/nuxtjs-logo.png"
          alt="nuxtjs-logo"
        />
        <img
          class="lg:h-20 lg:w-20 w-10 h-10 mr-5 ml-8 self-center"
          src="./assets/img/react-logo.png"
          alt="react-logo"
        />
      </div>
    </div>

    <!--==========================================
                  FREE NFT
    ===========================================-->
    <div
      class="ring-offset-white ring-offset-1/2 ring-white/20 ring-1 bg-indigo-200/10 grid md:mt-20 mt-10 ml-8 mr-8 mb-5 md:mb-10 p-6 md:p-8 lg:w-3/6 h-fit rounded-xl justify-self-center"
    >
      <ModalTxProgress
        class="hidden absolute left-1/2 transform -translate-x-1/2 -translate-y-1/4"
        id="modal"
      />
      <h2 class="lg:text-3xl text-2xl font-bold text-center text-white">
        Receive a free NFT
      </h2>
      <p class="text-lg mt-4 font-medium text-left text-white">
        Enter your Ethereum wallet address
      </p>
      <p class="text-lg font-medium text-left text-red-500 hidden" id="error">
        An error has occurred, please check your address!
      </p>
      <p
        class="text-lg font-medium text-left text-green-500 hidden"
        id="success"
      >
        Successful transaction: See on
        <a id="link" class="underline decoration-sky-500 font-bold"
          >polygonscan</a
        >
      </p>
      <input
        class="mt-2 justify-self-center p-2 rounded-lg md:rounded w-full"
        v-model="wallet"
        placeholder="Your Wallet Address"
      />
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-1/2 justify-self-center mt-6"
        @click="mintNFT"
      >
        Mint NFT
      </button>
    </div>

    <Footer />
  </div>
</template>

<script>
import Timeline from "./components/Timeline.vue";
import Skills from "./components/Skills.vue";
import ServiceCard from "@/components/ServiceCard.vue";

export default defineNuxtComponent({
  components: {
    Timeline,
    Skills,
    ServiceCard,
  },

  data: () => ({
    hash: "",
    wallet: "",
    formation: [
      {
        logo: "cranfield_logo2.png",
        title:
          'Cranfield University - <a class="underline decoration-sky-500 font-bold text-sky-400/100" href="https://www.cranfield.ac.uk/courses/taught/computational-intelligence-for-data-analytics" target="_blank">MSc in Computational and Software Techniques in Engineering</a>',
        description:
          "MSc at Cranfield University as part of a double degree programme with ISEP. <br/><br/> Cranfield University, located in the UK, is a distinguished public institution exclusively dedicated to postgraduate education and research. It boasts a specialization in science, engineering, technology, and management, holding the unique distinction of being the UK's sole postgraduate-only university. <br/><br/> Modules studied: <br/> - Machine Learning and Big Data <br/> - Artificial Intelligence <br/> - High Performance Technical Computing  <br/> - Cloud Computing <br/> - Small-Scale Parallel Programming <br/> - Management for Technology",
        period: "Sept. 2023 - Sept. 2024",
      },
      {
        logo: "isep.png",
        title:
          'ISEP - <a class="underline decoration-sky-500 font-bold text-sky-400/100" href="https://en.isep.fr/studying-at-isep/isep-engineering-master-degree/" target="_blank">Engineering Master Degree</a>',
        description:
          "Engineering cycle at ISEP in Paris. Specialisation in Data Intelligence. <br/><br/> ISEP is a French digital engineering school located in Paris. It trains general engineers in the key fields of digital technology: IT & Cybersecurity - Electronics & Robotics - Telecommunications & Internet of Things - Imaging - Artificial Intelligence.",
        period: "2021 - 2024",
      },
      {
        logo: "cvut.png",
        title: "CVUT - Academic Semester Abroad",
        description:
          "Academic semester in English at the Czech Technical University in Prague. <br/><br/> Modules studied: <br/> - Telecommunication Systems and Networks <br/> - Introduction to Cyber Security <br/> - Environmental Engineering  <br/> - Discrete mathematics <br/> - Programming <br/> - English",
        period: "Feb. 2021 - Jun. 2021",
      },
      {
        logo: "isep.png",
        title:
          'ISEP - <a class="underline decoration-sky-500 font-bold text-sky-400/100" href="https://en.isep.fr/cii/" target="_blank">International Integrated Cycle (CII)</a>',
        description:
          "Preparatory years at the ISEP engineering school in Paris. <br/><br/> The CII follows a programme specific to ISEP, balanced across three teaching areas: Fundamental Digital Sciences | Techniques & Technologies | Languages, Cultures, Humanities and Sustainable Development. It includes an international semester from the second year.",
        period: "2019 - 2021",
      },
      // Add more sample data here
    ],
    experience: [
      {
        logo: "garage.png",
        title:
          'Vice President of the <a class="font-bold">Blockchain Lab</a> at <a class="underline decoration-sky-500 font-bold text-sky-400/100" href="https://garageisep.com/" target="_blank">Garage ISEP</a>',
        description:
          "Garage ISEP is the student association of ISEP dedicated to technology (Blockchain, Artificial Intelligence, ...). Organization of workshops and conferences to learn and master Blockchain technologies.",
        period: "Sept. 2022 - Sept. 2023",
      },
      {
        logo: "cs.png",
        title:
          'Blockchain Developer at <a class="underline decoration-sky-500 font-bold text-sky-400/100" href="https://coinshares.com/" target="_blank">CoinShares</a>',
        description:
          "CoinShares is Europe's largest and oldest crypto asset investment company, managing billions of dollars in assets. Discovery of Decentralized Finance within the DeFi team and realization of missions to build a decentralized asset management tool.",
        period: "Sept. 2022 - Jan. 2023",
      },
      {
        logo: "sleepn.png",
        title:
          'Blockchain Developer at <a class="underline decoration-sky-500 font-bold text-sky-400/100" href="https://github.com/SleepnClub/Sleepn-Contracts" target="_blank">Sleepn</a>',
        description:
          'Sleepn is a decentralized sleep tracking application that allows you to earn money by sleeping. Sleepn won 2 prizes at the <a class="underline decoration-sky-500 font-bold text-sky-400/100" href="https://showcase.ethglobal.com/hackmoney2022/sleepn-27hyu" target="_blank">2022 ETHGlobal HackMoney hackathon</a> : "<a class="text-lg font-bold">Polygon — Best App</a>" and "<a class="text-lg font-bold">Superfluid — Best Use With Another Partner</a>".',
        period: "May 2022 - Oct. 2023",
      },
    ],
    skillCategories: [
      {
        name: "Programming Languages",
        skills: [
          {
            name: "JavaScript",
            percentage: 100,
          },
          {
            name: "Solidity",
            percentage: 100,
          },
          {
            name: "Python",
            percentage: 90,
          },
          {
            name: "TypeScript",
            percentage: 90,
          },
          {
            name: "Java",
            percentage: 70,
          },
          {
            name: "Rust",
            percentage: 50,
          },
        ],
      },
      {
        name: "Frontend",
        skills: [
          {
            name: "ReactJS ",
            percentage: 80,
          },
          {
            name: "React Native",
            percentage: 80,
          },
          {
            name: "TailwindCSS",
            percentage: 80,
          },
          {
            name: "VueJS (Framework Nuxt)",
            percentage: 75,
          },
          {
            name: "HTML / CSS",
            percentage: 70,
          },
        ],
      },
      {
        name: "Backend",
        skills: [
          {
            name: "NodeJS (Framework NestJS)",
            percentage: 90,
          },
        ],
      },
      {
        name: "Blockchain",
        skills: [
          {
            name: "Hardhat",
            percentage: 100,
          },
          {
            name: "Foundry",
            percentage: 100,
          },
          {
            name: "Remix",
            percentage: 100,
          },
          {
            name: "Chainlink",
            percentage: 100,
          },
          {
            name: "Transaction tracking (Etherscan, Polygonscan, ...)",
            percentage: 100,
          },
          {
            name: "The Graph",
            percentage: 90,
          },
          {
            name: "Cosmos SDK",
            percentage: 80,
          },
        ],
      },
      {
        name: "Databases",
        skills: [
          {
            name: "MongoDB",
            percentage: 100,
          },
          {
            name: "MySQL",
            percentage: 100,
          },
          {
            name: "PostgreSQL",
            percentage: 90,
          },
          {
            name: "Cassandra",
            percentage: 90,
          },
          {
            name: "InfluxDB",
            percentage: 80,
          },
          {
            name: "Neo4j",
            percentage: 70,
          },
        ],
      },
      {
        name: "Data Engineering Tools",
        skills: [
          {
            name: "Apache Airflow",
            percentage: 90,
          },
          {
            name: "Elasticsearch",
            percentage: 90,
          },
          {
            name: "Kibana",
            percentage: 90,
          },
          {
            name: "Apache Spark",
            percentage: 80,
          },
          {
            name: "Apache Kafka",
            percentage: 70,
          },
        ],
      },
      {
        name: "Hosting Services",
        skills: [
          {
            name: "Digital Ocean",
            percentage: 90,
          },
          {
            name: "Cloudflare",
            percentage: 90,
          },
          {
            name: "AWS",
            percentage: 70,
          },
        ],
      },
      {
        name: "Server Management",
        skills: [
          {
            name: "Docker",
            percentage: 90,
          },
        ],
      },
      // Ajoutez d'autres catégories ici
    ],
    services: [
      {
        id: 0,
        title: "Data Analytics & Visualization",
        description:
          "Leverage the power of data to make informed decisions and gain a competitive edge with my data analytics and visualization services.",
        icon: "chart-bar", // or ''
      },
      {
        id: 1,
        title: "Data Science & Machine Learning",
        description:
          "Harness the power of data science and machine learning to gain valuable insights and make informed decisions.",
        icon: "brain", // or 'chart-network'
      },
      {
        id: 2,
        title: "Pipeline Development & Automation",
        description:
          "Setting up data pipelines and automating data processing tasks to ensure the seamless flow of data across your organization.",
        icon: "code", // or 'cog'
      },
      {
        id: 3,
        title: "Advanced Smart Contract Expertise",
        description:
          "Delve into a comprehensive suite of services, including development, deployment, security testing, and gas optimization for high-performance smart contracts.",
        icon: "file-contract", // or 'scroll'
      },
      {
        id: 4,
        title: "Customized NFT & Cryptocurrency Offerings",
        description:
          "Benefit from meticulously designed NFT collections and personalized cryptocurrencies, tailor-made to suit the unique requirements of each project.",
        icon: "coins", // or 'gem'
      },
      {
        id: 5,
        title: "Cutting-Edge DApp, API & Blockchain Solutions",
        description:
          "Experience seamless integration through the development and implementation of decentralized applications, web/mobile apps, APIs, and sophisticated blockchain transaction tracing capabilities.",
        icon: "cogs", // or 'network-wired'
      },
    ],
  }),

  methods: {
    async mintNFT() {
      document.getElementById("modal").classList.toggle("hidden");
      console.log("Minting NFT for address: " + this.wallet);
      const result = await this.asyncData();
      if (result.result.success == true) {
        console.log("NFT minted successfully");
        console.log("Transaction hash: " + result.result.hash);
        this.hash = result.result.hash;
        document.getElementById("link").href =
          "https://polygonscan.com/tx/" + this.hash;
        document.getElementById("success").classList.toggle("hidden");
      } else {
        console.log("NFT minting failed");
        document.getElementById("error").classList.toggle("hidden");
      }
      document.getElementById("modal").classList.toggle("hidden");
    },

    async asyncData() {
      return {
        result: await $fetch("https://api.balayre.xyz/contracts/mintNft", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache",
          body: JSON.stringify({
            wallet: this.wallet,
          }),
        }),
      };
    },
  },
});
</script>
