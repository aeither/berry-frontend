import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import {
  Stack,
  Heading,
  Box,
  Button,
  HStack,
  useColorModeValue,
  Image,
  Container,
  SlideFade,
} from "@chakra-ui/react";
import ClubPage from "./pages/ClubPage";
import FarmPage from "./pages/FarmPage";
import CardsPage from "./pages/CardsPage";
import Logo from "./images/berrylogo.png";

export default function App() {
  return (
    <Router>
      <Stack
        w="100%"
        px="4"
        py="6"
        background="brand.900"
        overflow="hidden"
        direction="row"
        justify="space-between"
        fontSize="lg"
      >
        <SlideFade in>
          <Container maxW="7xl" pt={4}>
            <HStack spacing="4">
              <Link to="/">
                <HStack pr="4">
                  <Image src={Logo} boxSize="50px" alt="Berry Cards" />
                  <Heading size="xl" color="brand.100">
                    Berry
                  </Heading>
                </HStack>
              </Link>
              <Link to="/">Club</Link>
              <Link to="/farm">Farm</Link>
              <Link to="/cards">Cards</Link>
              <a href="https://app.ref.finance/#wrap.near">REF Finance</a>
            </HStack>
          </Container>
        </SlideFade>
      </Stack>
      <SlideFade in>
        <Container maxW="7xl" pt={4}>
          <Switch>
            <Route path="/farm">
              <FarmPage />
            </Route>
            <Route path="/cards">
              <CardsPage />
            </Route>
            <Route path="/">
              <ClubPage />
            </Route>
          </Switch>
        </Container>
      </SlideFade>
    </Router>
  );
}
