import ServiceSection from "../../../../components/homepage/customersupport";

// pages/about.js
export default function About() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* About Section */}
      <section className="text-left mb-12">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-gray-700 leading-relaxed text-justify">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eros nibh, molestie a sapien quis, pulvinar ornare neque. Phasellus dignissim, odio et blandit suscipit, massa orci scelerisque dui, eu luctus metus turpis quis est. Fusce urna nunc, luctus at massa vitae, semper efficitur massa. Curabitur dictum eleifend tellus. Cras sit amet enim at mauris scelerisque egestas in eu diam. Ut ut leo volutpat eros rutrum congue at vel nunc. Aliquam vehicula orci sit amet est luctus ornare. Sed sodales malesuada lobortis. Integer sit amet dictum elit. Aenean et varius odio. Ut nulla enim, volutpat a cursus at, tempus sed purus. Maecenas consectetur lorem ultrices, tempus erat eu, venenatis neque. In consectetur tellus ac lacus posuere, vel ullamcorper augue euismod.
        </p>
        <p className="text-gray-700 leading-relaxed mt-4 text-justify">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eros nibh, molestie a sapien quis, pulvinar ornare neque. Phasellus dignissim, odio et blandit suscipit, massa orci scelerisque dui, eu luctus metus turpis quis est. Fusce urna nunc, luctus at massa vitae, semper efficitur massa. Curabitur dictum eleifend tellus. Cras sit amet enim at mauris scelerisque egestas in eu diam. Ut ut leo volutpat eros rutrum congue at vel nunc. Aliquam vehicula orci sit amet est luctus ornare. Sed sodales malesuada lobortis. Integer sit amet dictum elit. Aenean et varius odio. Ut nulla enim, volutpat a cursus at, tempus sed purus. Maecenas consectetur lorem ultrices, tempus erat eu, venenatis neque. In consectetur tellus ac lacus posuere, vel ullamcorper augue euismod.
        </p>
      </section>

      {/* Team Section */}
      <section className="text-center mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8">
          {/* Team Member */}
          <div className="text-center">
            <img
              src="https://randomuser.me/api/portraits/men/1.jpg"
              alt="Shoaib"
              className=" mx-auto mb-2 w-32 h-32 md:w-64 md:h-64 object-cover"
            />
            <h3 className="text-[#FF0000] font-bold text-lg">Shoaib</h3>
            <p className="text-gray-600">Founder And CEO</p>
          </div>

          <div className="text-center">
            <img
              src="https://randomuser.me/api/portraits/men/2.jpg"
              alt="Kashif"
              className=" mx-auto mb-2 w-32 h-32 md:w-64 md:h-64 object-cover"
            />
            <h3 className="text-[#FF0000] font-bold text-lg">Robert</h3>
            <p className="text-gray-600">Sales Head</p>
          </div>

          <div className="text-center">
            <img
              src="https://randomuser.me/api/portraits/women/1.jpg"
              alt="Saria"
              className=" mx-auto mb-2 w-32 h-32 md:w-64 md:h-64 object-cover"
            />
            <h3 className="text-[#FF0000] font-bold text-lg">Alexa</h3>
            <p className="text-gray-600">Operation Manager</p>
          </div>

          <div className="text-center">
            <img
              src="https://randomuser.me/api/portraits/men/3.jpg"
              alt="Rafy"
              className=" mx-auto mb-2 w-32 h-32 md:w-64 md:h-64 object-cover"
            />
            <h3 className="text-[#FF0000] font-bold text-lg">Waqas</h3>
            <p className="text-gray-600">Founder And CEO</p>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="mb-12">
        <img
          src="/images/image2.jpeg"
          alt="Car Repair"
          className="w-full h-auto rounded-lg shadow-md mx-auto"
        />
      </section>

      {/* Footer Icons Section */}
      <ServiceSection/>
    </div>
  );
}
